"use client"

import { useState } from "react";
import NewTransactionCard from "./components/dashboard/NewTransactionCard";
import TransactionList from "./components/dashboard/TransactionList";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import BalanceCard from "./components/dashboard/BalanceCard";

export default function Home() {
    const [transactions, setTransactions] = useState<{ id: number; type: string; amount: number; date: string }[]>([]);

    const balance = transactions.reduce((total, t) => {
      if (t.type === "Depósito") {
        return total + t.amount;
      } else {
        return total - t.amount;
      }
    }, 0);

    const handleDelete = (index: number) => {
      setTransactions(transactions.filter((_, i) => i !== index));
    };

  return (
    <main style={{ display: "flex", height: "100vh", background: "#f5f5f5" }}>
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

        <NewTransactionCard onAdd={(transaction) => setTransactions([...transactions, transaction])} />
      </div>
      <TransactionList
        transactions={transactions}
        onDelete={handleDelete}
      />
    </main>
  );
}
