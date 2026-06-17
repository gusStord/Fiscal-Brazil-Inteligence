# Brazil Fiscal Intelligence Dashboard

Dashboard de Inteligência Fiscal do Brasil construído com **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS 4** e **shadcn/ui**.

O projeto apresenta dados fiscais brasileiros (receitas, despesas, investimentos, municípios) de forma visual e educativa, com modos de apresentação, sala de aula e plano de aula para professores.

## Funcionalidades

- Página inicial com KPIs, gráficos, curiosidades, quiz e fatos do dia
- Página de Receitas
- Página de Despesas
- Página de Investimentos
- Página de Municípios
- Simulador fiscal
- Calculadora fiscal
- Glossário
- Modo Apresentação / Sala de Aula / Plano de Aula
- Comparação internacional
- Dados por capital (per capita)
- Exportação de gráficos

## Stack Tecnológica

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript 5
- **Estilo**: Tailwind CSS 4
- **UI**: shadcn/ui (estilo New York) + Lucide icons
- **Gráficos**: Recharts
- **Banco de dados**: Prisma ORM (SQLite)
- **Ícones**: lucide-react

## Começando

### Pré-requisitos

- Node.js 18+ (recomendado 20+)
- Bun (opcional, mas recomendado) ou npm/yarn/pnpm

### Instalação

```bash
# Instalar dependências
bun install
# ou
npm install

# Rodar em modo desenvolvimento
bun run dev
# ou
npm run dev

# Abrir http://localhost:3000
```

### Build de produção

```bash
bun run build
# ou
npm run build

# Rodar produção
bun run start
# ou
npm run start
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=file:./db/custom.db
```

### Banco de dados (Prisma)

```bash
# Editar prisma/schema.prisma conforme necessário
bun run db:push
```

## Estrutura do Projeto

```
.
├── prisma/             # Schema do Prisma
├── db/                 # Banco SQLite
├── public/             # Arquivos estáticos
│   └── data/           # Dados JSON
├── src/
│   ├── app/            # Páginas (App Router)
│   │   ├── page.tsx              # Home
│   │   ├── receitas/             # Receitas
│   │   ├── despesas/             # Despesas
│   │   ├── investimentos/        # Investimentos
│   │   ├── municipios/           # Municípios
│   │   ├── simulador/            # Simulador
│   │   ├── calculadora/          # Calculadora
│   │   ├── glossario/            # Glossário
│   │   └── api/                  # Rotas de API
│   ├── components/
│   │   ├── ui/         # Componentes shadcn/ui
│   │   └── dashboard/ # Componentes do dashboard
│   ├── lib/            # Utilitários e dados
│   │   ├── brazil-data.ts        # Dados fiscais
│   │   ├── db.ts                 # Cliente Prisma
│   │   ├── api-client.ts
│   │   └── utils.ts
│   └── hooks/          # React hooks
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Rotas

| Rota            | Descrição                              |
| --------------- | -------------------------------------- |
| `/`             | Dashboard principal                    |
| `/receitas`     | Análise de receitas                    |
| `/despesas`     | Análise de despesas                    |
| `/investimentos`| Análise de investimentos               |
| `/municipios`   | Dados por município                    |
| `/simulador`    | Simulador fiscal                       |
| `/calculadora`  | Calculadora fiscal                     |
| `/glossario`    | Glossário de termos fiscais            |
| `/api/data`     | API de dados fiscais                   |
| `/api/health`   | Health check                           |

## Licença

Este projeto é privado/educacional.
