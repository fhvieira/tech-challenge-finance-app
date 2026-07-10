"use client";

import { useMemo, useState } from "react";

type Transaction = {
  id: number;
  type: string;
  description?: string;
  category?: string;
  receipt?: {
    name: string;
    type: string;
    size: number;
    dataUrl: string;
  };
  amount: number;
  date: string;
};

type TransactionsFeatureProps = {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onUpdate: (transaction: Transaction) => void;
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

export default function TransactionsFeature({
  transactions,
  onDelete,
  onUpdate,
}: TransactionsFeatureProps) {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        transactions.map(
          (transaction) => transaction.category?.trim() || "Sem categoria"
        )
      )
    );
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const category = transaction.category?.trim() || "Sem categoria";
      const matchesSearch =
        normalizedSearch === "" ||
        (transaction.description ?? "").toLowerCase().includes(normalizedSearch) ||
        category.toLowerCase().includes(normalizedSearch);
      const matchesType =
        typeFilter === "all" || transaction.type === typeFilter;
      const matchesCategory =
        categoryFilter === "all" || categoryFilter === category;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [categoryFilter, search, transactions, typeFilter]);

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Transações</h2>
          <p className="text-sm text-slate-500">Remote via Module Federation</p>
        </div>
        <span className="rounded-md bg-[#eef2f3] px-2 py-1 text-sm font-bold text-slate-700">
          transactionsRemote
        </span>
      </div>

      {editingTransaction && (
        <EditTransactionForm
          transaction={editingTransaction}
          onCancel={() => setEditingTransaction(null)}
          onSave={(updatedTransaction) => {
            onUpdate(updatedTransaction);
            setEditingTransaction(null);
          }}
        />
      )}

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar descrição ou categoria"
          className="rounded-lg border border-slate-300 p-3"
        />

        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          className="rounded-lg border border-slate-300 p-3"
        >
          <option value="all">Todos os tipos</option>
          <option value="Depósito">Depósito</option>
          <option value="Transferência">Transferência</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-lg border border-slate-300 p-3"
        >
          <option value="all">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left text-slate-600">
              <th className="py-3 pr-4">Tipo</th>
              <th className="py-3 pr-4">Descrição</th>
              <th className="py-3 pr-4">Categoria</th>
              <th className="py-3 pr-4">Data</th>
              <th className="py-3 pr-4 text-right">Valor</th>
              <th className="py-3 text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b last:border-b-0">
                <td className="py-3 pr-4">{transaction.type}</td>
                <td className="py-3 pr-4">
                  {transaction.description?.trim() || "-"}
                </td>
                <td className="py-3 pr-4">
                  {transaction.category?.trim() || "Sem categoria"}
                </td>
                <td className="py-3 pr-4">{formatDate(transaction.date)}</td>
                <td className="py-3 pr-4 text-right font-medium">
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingTransaction(transaction)}
                      className="rounded-md bg-[#eef2f3] px-2 py-1 transition hover:bg-[#dfe5e7]"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(transaction.id)}
                      className="rounded-md bg-[#ffecec] px-2 py-1 transition hover:bg-[#ffdede]"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">
          Nenhuma transação encontrada
        </p>
      )}
    </section>
  );
}

function EditTransactionForm({
  transaction,
  onCancel,
  onSave,
}: {
  transaction: Transaction;
  onCancel: () => void;
  onSave: (transaction: Transaction) => void;
}) {
  const [type, setType] = useState(transaction.type);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [date, setDate] = useState(transaction.date);
  const [description, setDescription] = useState(transaction.description ?? "");
  const [category, setCategory] = useState(transaction.category ?? "");

  return (
    <div className="mb-5 rounded-2xl bg-[#f8fafc] p-4">
      <h3 className="mb-3 text-lg font-bold">Editar transação</h3>
      <div className="grid gap-3 md:grid-cols-3">
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="rounded-lg border border-slate-300 p-3"
        >
          <option value="Depósito">Depósito</option>
          <option value="Transferência">Transferência</option>
        </select>
        <input
          type="number"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="rounded-lg border border-slate-300 p-3"
        />
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="rounded-lg border border-slate-300 p-3"
        />
        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Descrição"
          className="rounded-lg border border-slate-300 p-3"
        />
        <input
          type="text"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Categoria"
          className="rounded-lg border border-slate-300 p-3"
        />
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() =>
            onSave({
              ...transaction,
              type,
              amount: Number(amount),
              date,
              description: description.trim() || undefined,
              category: category.trim() || undefined,
            })
          }
          className="rounded-lg bg-teal-900 px-4 py-3 font-bold text-white transition hover:bg-teal-950"
        >
          Salvar alteração
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-3 font-bold text-slate-700 transition hover:bg-slate-100"
        >
          Cancelar edição
        </button>
      </div>
    </div>
  );
}
