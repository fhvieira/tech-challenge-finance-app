"use client";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { useTransactions } from "../hooks/useTransactions";
import { useState } from "react";
import { Transaction } from "../types";
import TransactionTable from "../components/dashboard/TransactionTable";
import NewTransactionCard from "../components/dashboard/NewTransactionCard";

export default function TransactionsPage() {
  const { transactions, setTransactions } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = (id: number) => {
    setTransactions((current) =>
      current.filter((t) => t.id !== id)
    );
  };

  const handleUpdate = (updatedTransaction: Transaction) => {
    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );

    setEditingTransaction(null);
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#f4f6f8] text-slate-900 lg:flex-row">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col gap-5 p-4 sm:p-5">
        <Header />

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          {editingTransaction && (
            <NewTransactionCard
              onAdd={() => {}}
              editingTransaction={editingTransaction}
              onUpdate={handleUpdate}
              onCancelEdit={() => setEditingTransaction(null)}
            />
          )}
          <TransactionTable
            transactions={transactions}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </section>
      </div>
    </main>
  );
}