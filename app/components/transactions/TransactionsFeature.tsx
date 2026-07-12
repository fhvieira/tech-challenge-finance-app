"use client";

import { useState } from "react";
import { Transaction } from "../../types";
import NewTransactionCard from "../dashboard/NewTransactionCard";
import TransactionTable from "../dashboard/TransactionTable";

type TransactionsFeatureProps = {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onUpdate: (transaction: Transaction) => void;
};

export default function TransactionsFeature({
  transactions,
  onDelete,
  onUpdate,
}: TransactionsFeatureProps) {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const handleUpdate = (updatedTransaction: Transaction) => {
    onUpdate(updatedTransaction);
    setEditingTransaction(null);
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      {editingTransaction && (
        <div className="mb-5">
          <NewTransactionCard
            onAdd={() => {}}
            editingTransaction={editingTransaction}
            onUpdate={handleUpdate}
            onCancelEdit={() => setEditingTransaction(null)}
          />
        </div>
      )}
      <TransactionTable
        transactions={transactions}
        onDelete={onDelete}
        onEdit={setEditingTransaction}
      />
    </section>
  );
}
