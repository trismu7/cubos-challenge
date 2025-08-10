#!/bin/sh

# Aguardar o banco de dados estar disponível
echo "Aguardando o banco de dados..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "Banco de dados está disponível!"

# Executar migrações do Prisma
echo "Executando migrações do banco de dados..."
npx prisma db push

# Executar seed se especificado
if [ "$RUN_SEED" = "true" ]; then
  echo "Executando seed do banco de dados..."
  npx tsx prisma/seed.ts
fi

# Iniciar a aplicação
echo "Iniciando a aplicação..."
exec node server.js
