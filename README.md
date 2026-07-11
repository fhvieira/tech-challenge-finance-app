# Tech Challenge - Dashboard Financeiro

Este projeto foi desenvolvido como parte do Tech Challenge – Fase 2 da Pós-Tech FIAP. O objetivo foi evoluir a aplicação de gerenciamento financeiro da Fase 1 adicionando novas funcionalidades, arquitetura baseada em microfrontends, containerização com Docker e deploy em ambiente cloud.

## Aplicação Publicada

- Shell/dashboard: https://tech-challenge-finance-app.vercel.app
- Transactions remote: https://transactions-remote.vercel.app
- Rota federada de transacoes: https://tech-challenge-finance-app.vercel.app/trasacoes

## Visao Geral

O projeto permite que o usuario:

- Visualize o saldo da conta
- Consulte graficos financeiros do dashboard
- Veja receitas, despesas e evolucao de saldo a partir das transacoes
- Adicione, edite e exclua transacoes
- Busque e filtre transacoes por descricao, categoria, tipo e periodo
- Use paginacao client-side na tabela de transacoes
- Valide entradas do formulario antes de salvar
- Receba sugestoes automaticas de categorias por tipo de transacao
- Anexe comprovantes ou documentos a uma transacao
- Persista os dados localmente utilizando `localStorage`

A interface foi inspirada no layout fornecido no Figma, priorizando clareza, usabilidade e responsividade.

Durante o desenvolvimento também foram adotadas boas práticas de experiência do usuário, como layout responsivo, componentes HTML semânticos e organização consistente da interface, buscando melhorar a acessibilidade da aplicação.

## Principais melhorias da Fase 2

Nesta fase foram adicionados:

- Graficos no dashboard: resumo de receitas vs despesas, gastos por categoria e evolucao recente do saldo
- Melhorias na lista de transacoes: busca, filtros e paginacao client-side
- Melhorias no formulario: validacao avancada, sugestoes de categorias e anexo de comprovante/documento
- Prova de conceito de microfrontend com Module Federation
- Suporte a Docker e Docker Compose para executar shell e remote juntos
- Configuracao de deploy separado para shell e remote na Vercel

## Requisitos da Fase 2 Atendidos

- ✅ Dashboard com gráficos financeiros
- ✅ Busca e filtros avançados
- ✅ Paginação client-side
- ✅ Validação avançada
- ✅ Sugestões automáticas de categorias
- ✅ Upload de comprovantes/documentos
- ✅ Arquitetura baseada em microfrontends (Module Federation)
- ✅ Docker e Docker Compose
- ✅ Deploy em cloud (Vercel)

## Arquitetura de Microfrontend

A aplicacao principal continua sendo o **shell/container**. Ela fica na raiz do projeto e e responsavel por:

- Rotas principais
- Layout geral
- Dashboard
- Hook `useTransactions`
- Persistencia em `localStorage`
- Passagem de dados e callbacks para o remote

O microfrontend **transactions remote** fica em `transactions-remote/` e expoe:

```txt
transactionsRemote/TransactionsFeature
```

A rota `/trasacoes` do shell carrega esse remote via Module Federation. O shell passa `transactions`, `onAdd`, `onDelete` e `onUpdate` como props. O remote nao acessa diretamente o `localStorage`; todas as mutacoes continuam centralizadas no shell.

O remote entry local fica em:

```txt
http://127.0.0.1:3001/_next/static/chunks/remoteEntry.js
```

Em producao, o shell usa:

```txt
https://transactions-remote.vercel.app/_next/static/chunks/remoteEntry.js
```

Caso o remote esteja indisponivel no browser, o shell usa uma implementacao local de fallback e exibe um aviso simples na tela de transacoes.

## Tecnologias

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Webpack Module Federation
- Storybook
- Docker
- Vercel

## Estrutura do Projeto

```txt
.
├── app/
│   ├── page.tsx
│   ├── trasacoes/page.tsx
│   ├── hooks/useTransactions.ts
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DashboardCharts.tsx
│   │   │   ├── BalanceCard.tsx
│   │   │   ├── NewTransactionCard.tsx
│   │   │   ├── TransactionList.tsx
│   │   │   └── TransactionTable.tsx
│   │   ├── layout/
│   │   └── transactions/
│   │       ├── RemoteTransactionsFeature.tsx
│   │       └── TransactionsFeature.tsx
│   ├── remote-modules.d.ts
│   └── types.ts
├── transactions-remote/
│   ├── app/
│   │   ├── page.tsx
│   │   └── remote/TransactionsFeature.tsx
│   ├── Dockerfile
│   ├── next.config.ts
│   └── package.json
├── Dockerfile
├── docker-compose.yml
├── next.config.ts
└── docs/module-federation-poc.md
```

## Como Executar Localmente

Instale as dependencias da aplicacao principal:

```bash
npm install
```

Instale as dependencias do remote:

```bash
npm --prefix transactions-remote install
```

Em um terminal, execute o transactions remote:

```bash
npm run dev:remote
```

Em outro terminal, execute o shell:

```bash
npm run dev
```

Acesse:

```txt
http://127.0.0.1:3000
http://127.0.0.1:3000/trasacoes
```

Por padrao, o shell procura o remote em `http://127.0.0.1:3001`. Para apontar para outro remote, defina:

```bash
NEXT_PUBLIC_TRANSACTIONS_REMOTE_URL=https://transactions-remote.vercel.app
```

## Build e Qualidade

```bash
npm run lint
npm run build:remote
npm run build
```

Como o projeto utiliza Next.js 16 com App Router, os builds são executados utilizando `--webpack` para suportar Module Federation.

## Docker

Para construir e executar shell e remote juntos:

```bash
docker compose up --build
```

Servicos expostos:

```txt
Shell:  http://localhost:3000
Remote: http://localhost:3001
```

Para parar:

```bash
docker compose down
```

O `docker-compose.yml` publica os dois servicos e configura o shell para consumir o remote em `http://127.0.0.1:3001`.

## Design System e Storybook

Foi criado um pequeno design system baseado em componentes reutilizaveis e Tailwind CSS. Os principais criterios mantidos no projeto sao:

- Consistencia de espacamento e layout
- Hierarquia visual clara
- Responsividade para desktop e mobile
- Cores inspiradas no Figma

Foi utilizado Storybook para documentar componentes personalizados da aplicacao.

```bash
npm run storybook
```

Componentes documentados incluem:

- `Header`
- `Sidebar`
- `BalanceCard`
- `NewTransactionCard`
- `TransactionList`

## Demonstracao

O fluxo de demonstracao recomendado para a entrega inclui:

- Navegacao pelo dashboard
- Criacao, edicao e exclusao de transacoes
- Uso dos filtros, busca e paginacao
- Visualizacao dos graficos financeiros
- Persistencia dos dados apos atualizar a pagina
- Acesso a rota federada `/trasacoes`
- Execucao do Storybook, se necessario

## Observacoes

- Nao ha back-end; os dados sao gerenciados no front-end.
- As transacoes sao armazenadas no `localStorage`.
- O Figma foi utilizado como referencia visual, sem seguir rigidamente cada detalhe.
