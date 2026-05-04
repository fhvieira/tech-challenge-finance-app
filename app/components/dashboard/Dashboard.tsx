"use client"

import { useState } from "react";
import BalanceCard from "./BalanceCard";
import NewTransactionCard from "./NewTransactionCard";
import TransactionList from "./TransactionList";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import { Transaction } from "../../types";
import { useTransactions } from "../../hooks/useTransactions";

export default function Dashboard() {

  const { transactions, setTransactions } = useTransactions();  
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const balance = transactions.reduce((total, t) => {
    if (t.type === "Depósito") {
      return total + t.amount;
    } else {
      return total - t.amount;
    }
  }, 0);

  const handleUpdate = (updatedTransaction: Transaction) => {
    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
    setEditingTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = (id: number) => {
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== id)
    );

    setSelectedTransaction((currentSelectedTransaction) =>
      currentSelectedTransaction?.id === id ? null : currentSelectedTransaction
    );
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#f4f6f8] text-slate-900 lg:flex-row">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-5 p-4 sm:p-5">
        <Header />
        <BalanceCard balance={balance} />

        <NewTransactionCard
          onAdd={(transaction) =>
            setTransactions((currentTransactions) => [
              ...currentTransactions,
              transaction,
            ])
          }
          editingTransaction={editingTransaction}
          onUpdate={handleUpdate}
          onCancelEdit={() => setEditingTransaction(null)}
        />
      </div>
      <TransactionList
        transactions={transactions}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onView={(transaction) => setSelectedTransaction(transaction)}
        selectedTransaction={selectedTransaction}
      />
    </main>
  );
}
