# 🎬 Cubos Movies

**Cubos Movies** é uma aplicação web responsiva de gerenciamento de filmes desenvolvida para o desafio técnico da Cubos Tecnologia. A aplicação permite que usuários cadastrem, editem, excluam e visualizem detalhes de filmes, também permite busca, filtragem e notificações por email.

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.13.0-2D3748?style=flat-square&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC?style=flat-square&logo=tailwind-css)

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Configuração do Banco de Dados](#️-configuração-do-banco-de-dados)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Como Executar](#como-executar)
- [Estrutura do Projeto](#-estrutura-do-projeto)

## ✨ Funcionalidades

### 🔐 Autenticação e Autorização

- Sistema completo de login e cadastro de usuários
- Autenticação via JWT
- Recuperação de senha via email
- Middleware de proteção de rotas

### 🎭 Gerenciamento de Filmes

- **CRUD completo**: Criar, ler, atualizar e deletar filmes
- **Permissões**: Usuários só podem gerenciar seus próprios filmes
- **Integração IMDB**: Suporte para busca por ID e preenchimento automático de dados

### 🔍 Busca e Filtragem Avançada

- **Busca textual**: Pesquisa por título, sinopse e descrição
- **Filtros múltiplos**:
  - Duração (minutos)
  - Data de lançamento (período personalizado)
  - Votos IMDB
  - Nota IMDB
- **Paginação**: Mínimo de 10 filmes por página com customização

### 📧 E-mails

- **Notificação de boas vindas**: Envia um email de boas vindas para o usuário após o cadastro
- **E-mail de recuperação de senha**: Envia um email de recuperação de senha para o usuário
- **Lembretes automáticos**: Email de notificação na data de estreia
- **Cron jobs**: Verificação diária de lançamentos

### 🎨 Interface e UX

- **Design responsivo**: Breakpoints para mobile, tablet e desktop
- **Tema claro/escuro**: Botão para alternar entre os temas (Observação: next-themes pode gerar um aviso de erro do tipo Hydratation Error, mas funciona normalmente)
- **Componentes reutilizáveis**: UI moderna utilizando shadcn/ui e Tailwind CSS
- **Feedback visual**: Toasts e loading states

## 🛠 Stack Tecnológica

### Frontend

- **[Next.js 15.4.6](https://nextjs.org/)** - Framework React com App Router
- **[React 19.1.0](https://react.dev/)** - Biblioteca para interfaces de usuário
- **[TypeScript 5.x](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[Tailwind CSS 4.1.11](https://tailwindcss.com/)** - Framework CSS utilitário
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes acessíveis e customizáveis
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript-first

### Backend

- **[Prisma ORM 6.13.0](https://www.prisma.io/)** - ORM type-safe para PostgreSQL
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Jose](https://github.com/panva/jose)** - Biblioteca JWT para autenticação
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Hash de senhas
- **[Resend](https://resend.com/)** - Serviço de envio de emails

### Ferramentas de Desenvolvimento

- **[ESLint](https://eslint.org/)** - Linting de código
- **[Lucide React](https://lucide.dev/)** - Ícones SVG

## 📋 Pré-requisitos

### Para desenvolvimento local:

- **[Node.js](https://nodejs.org/)** (versão 18.x ou superior)
- **[PostgreSQL](https://www.postgresql.org/)** (versão 12.x ou superior)
- **[npm](https://www.npmjs.com/)** ou **[pnpm](https://pnpm.io/)** ou **[yarn](https://yarnpkg.com/)** ou **[bun](https://bun.sh/)**

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd cubos-challenge
```

### 2. Instale as dependências

```bash
npm install
# ou
pnpm install
# ou
yarn install
# ou
bun install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e preencha as variáveis necessárias:

```bash
cp .env.example .env
```

## 🗄️ Configuração do Banco de Dados

### 1. Configurar PostgreSQL

Certifique-se de que o PostgreSQL está rodando, crie um banco de dados, depois preencha a URL de conexão no arquivo `.env`

### 2. Executar migrações do Prisma

```bash
# Gerar o cliente Prisma
npx prisma generate

# Aplicar as migrações no banco
npx prisma db push
```

### 3. Seed do banco (opcional - recomendado)

Para popular o banco com dados de exemplo:

```bash

# Com bun (recomendado)
bun run prisma/seed.ts

# Ou
tsx prisma/seed.ts
```

Isso vai criar um usuário com email `user@user.com` e senha `123456`, o login pode ser feito também com o username `user` e senha `123456`, além disso, também vai popular o banco com alguns filmes extraídos da API do Open Movie Database e vincular ao usuário previamente criado.

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/cubos_movies"

# JWT
JWT_SECRET="seu_jwt_secret_aqui"

# Email (Resend)
RESEND_API_KEY="sua_chave_do_resend"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Configuração do Resend (Email)

1. Crie uma conta em [resend.com](https://resend.com)
2. Gere uma API key no dashboard
3. Configure o domínio para envio de e-mails

## Como Executar

### 🐳 Com Docker (Recomendado)

- **[Docker](https://www.docker.com/)** (versão 20 ou superior)
- **[Docker Compose](https://docs.docker.com/compose/)** (versão 2 ou superior)

A maneira mais fácil de executar o projeto é usando Docker:

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd cubos-challenge

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Importante: Edite o arquivo .env com suas configurações

# 3. Execute com Docker Compose
docker compose up -d
```

A aplicação estará disponível em `http://localhost:3000`

**Credenciais padrão** (quando RUN_SEED=true):

- Email: `user@user.com` ou Username: `user`
- Senha: `123456`

### 💻 Desenvolvimento Local (Sem Docker)

### Produção

```bash
# Build da aplicação
npm run build

# Executar em produção
npm run start
```

A aplicação estará disponível em `http://localhost:3000`

### Desenvolvimento

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

A aplicação estará disponível em `http://localhost:3000`

### Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento com Turbopack
- `npm run build` - Gera build de produção
- `npm run start` - Executa build de produção
- `npm run lint` - Executa linting do código

## 📁 Estrutura do Projeto

```
cubos-challenge/
├── prisma/                 # Configuração do banco de dados
│   ├── migrations/         # Migrações do banco
│   ├── schema.prisma       # Schema do Prisma
│   ├── seed.ts            # Script de seed
│   └── fetchMovies.ts     # Utilitário para buscar filmes
├── public/                 # Arquivos estáticos
│   └── assets/            # Imagens e recursos
├── src/
│   ├── app/               # App Router do Next.js
│   │   ├── api/           # API Routes
│   │   ├── main/          # Páginas principais
│   │   └── recover/       # Recuperação de senha
│   ├── components/        # Componentes React reutilizáveis
│   │   ├── ui/            # Componentes de UI base
│   │   ├── movie/         # Componentes específicos de filme
│   │   └── session/       # Componentes de autenticação
│   ├── lib/               # Utilitários e configurações
│   │   ├── actions/       # Server Actions
│   │   ├── auth/          # Lógica de autenticação
│   │   ├── formSchemas/   # Schemas de validação Zod
│   │   └── types/         # Definições de tipos TypeScript
│   ├── db/                # Configuração do banco
│   └── middleware.ts      # Middleware do Next.js
├── Dockerfile             # Configuração do container da aplicação
├── docker-compose.yml     # Orquestração dos serviços
├── docker-entrypoint.sh   # Script de inicialização do container
├── .dockerignore          # Arquivos ignorados no build Docker
├── .env.example           # Exemplo de variáveis de ambiente
├── components.json        # Configuração do shadcn/ui
├── package.json          # Dependências e scripts
└── tsconfig.json         # Configuração TypeScript
```

## Observações sobre Docker

- O PostgreSQL roda em um container separado com dados persistentes
- As migrações do banco são executadas automaticamente na inicialização
- O seed do banco é opcional e controlado pela variável `RUN_SEED` no arquivo `.env`
- A aplicação aguarda o banco estar disponível antes de iniciar
- Todos os logs são visíveis através do `docker compose logs`

Desenvolvido com ❤️ para o desafio da Cubos Tecnologia
