# Use a imagem oficial do Node.js 18 Alpine
FROM node:18-alpine AS base

# Instalar dependências do sistema necessárias
RUN apk add --no-cache libc6-compat netcat-openbsd curl unzip

# Estágio de dependências
FROM base AS deps
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar todas as dependências (incluindo dev)
RUN npm ci

# Estágio de build
FROM base AS builder
WORKDIR /app

# Copiar dependências instaladas
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Copiar arquivo .env
COPY .env .env

# Gerar o cliente Prisma
RUN npx prisma generate

# Build da aplicação Next.js
RUN npm run build

# Estágio de produção
FROM base AS runner
WORKDIR /app

# Copiar arquivos de build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copiar arquivos públicos
COPY --from=builder /app/public ./public

# Copiar arquivo .env e prisma
COPY --from=builder /app/.env .env
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Instalar dependências necessárias para o seed
RUN npm install -g tsx
RUN npm install bcryptjs @types/bcryptjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Copiar e configurar script de inicialização
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]
