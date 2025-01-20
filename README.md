# BeneMed API

Backend da aplicação BeneMed, responsável por gerenciar planos de saúde e informações relacionadas.

## Tecnologias

- Node.js
- Express
- TypeScript
- Supabase (PostgreSQL)

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento
- `npm run build`: Compila o TypeScript para JavaScript
- `npm start`: Inicia o servidor em modo de produção

## Endpoints

- `GET /api/plans`: Lista todos os planos de saúde
- `GET /health`: Verifica o status do servidor
