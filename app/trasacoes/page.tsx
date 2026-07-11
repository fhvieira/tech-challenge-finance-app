"use client";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { useTransactions } from "../hooks/useTransactions";
import RemoteTransactionsFeature from "../components/transactions/RemoteTransactionsFeature";

export default function TransactionsPage() {
  const { transactions, setTransactions } = useTransactions();

  const handleDelete = (id: number) => {
    setTransactions((current) =>
      current.filter((t) => t.id !== id)
    );
  };

  const handleUpdate = (updatedTransaction: typeof transactions[number]) => {
    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#f4f6f8] text-slate-900 lg:flex-row">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col gap-5 p-4 sm:p-5">
        <Header />

        <RemoteTransactionsFeature
          transactions={transactions}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </div>
    </main>
  );
}
