"use client";

import TransactionsFeature from "./remote/TransactionsFeature";

const demoTransactions = [
  {
    id: 1,
    type: "Depósito",
    description: "Salário",
    category: "Salário",
    amount: 4500,
    date: "2026-07-01",
  },
  {
    id: 2,
    type: "Transferência",
    description: "Mercado",
    category: "Alimentação",
    amount: 280,
    date: "2026-07-03",
  },
];

export default function RemotePreviewPage() {
  return (
    <main className="min-h-screen bg-[#f4f6f8] p-5 text-slate-900">
      <TransactionsFeature
        transactions={demoTransactions}
        onAdd={() => {}}
        onDelete={() => {}}
        onUpdate={() => {}}
      />
    </main>
  );
}
