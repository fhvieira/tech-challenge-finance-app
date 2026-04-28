"use client"

import { useEffect, useState } from "react";
import NewTransactionCard from "./components/dashboard/NewTransactionCard";
import TransactionList from "./components/dashboard/TransactionList";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import BalanceCard from "./components/dashboard/BalanceCard";
import { Transaction } from "./types";

export default function Home() {

  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    );
    setEditingTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");

    if (storedTransactions) {
      try {
        setTransactions(JSON.parse(storedTransactions));
      } catch {
        localStorage.removeItem("transactions");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f4f6f8",
      }}
    >
      <Sidebar />
      <div
        style={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Header />
        <BalanceCard balance={balance} />

        <NewTransactionCard
          onAdd={(transaction) =>
            setTransactions([...transactions, transaction])
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
