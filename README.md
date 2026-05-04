# Tech Challenge – Dashboard Financeiro

Aplicação front-end para gerenciamento de transações financeiras, desenvolvida com **Next.js (App Router)**.

## Visão Geral

Este projeto permite que o usuário:

- Visualize o saldo da conta
- Veja as transações agrupadas por mês
- Adicione novas transações
- Edite transações existentes
- Exclua transações
- Persista os dados localmente utilizando `localStorage`

A interface foi inspirada no layout fornecido no Figma, priorizando clareza, usabilidade e responsividade.

---

## Tecnologias

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

---

## Funcionalidades

- Dashboard com cálculo automático do saldo
- Listagem de transações agrupadas por mês
- Criar / Editar / Excluir transações
- Persistência local (sem necessidade de back-end)
- Layout responsivo (desktop e mobile)

---

## Design System

Foi criado um pequeno design system baseado em componentes reutilizáveis e Tailwind CSS.

### Storybook

Foi utilizado Storybook para documentar componentes personalizados da aplicação.

Para executar:

```bash
npm run storybook
```

### Componentes

- `Header`
- `Sidebar`
- `BalanceCard`
- `NewTransactionCard`
- `TransactionList`

### Princípios

- Consistência de espaçamento e layout
- Uso de componentes reutilizáveis
- Hierarquia visual clara
- Responsividade
- Cores inspiradas no Figma

---

## Estrutura do Projeto

```
app/
  page.tsx                // Componente servidor (entry point)
  components/
    dashboard/
      Dashboard.tsx       // Componente cliente com estado
      BalanceCard.tsx
      NewTransactionCard.tsx
      TransactionList.tsx
    layout/
      Header.tsx
      Sidebar.tsx
```

---

## Como executar

```bash
npm install
npm run dev
```

Acesse no navegador:

```
http://localhost:3000
```

---

## Observações

- Não há back-end; os dados são gerenciados no front-end.
- As transações são armazenadas no `localStorage`.
- O Figma foi utilizado como referência visual (não seguido rigidamente).

---

## Demonstração

O vídeo de demonstração apresenta:

- Navegação pela aplicação
- Criação de uma transação
- Edição de uma transação
- Exclusão de uma transação
- Persistência dos dados após atualização da página
- Storybook
