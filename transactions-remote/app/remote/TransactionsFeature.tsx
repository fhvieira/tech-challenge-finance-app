"use client";

import { FormEvent } from "react";

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
  onAdd: (transaction: Transaction) => void;
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
  onAdd,
  onDelete,
}: TransactionsFeatureProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const type = String(formData.get("type") ?? "");
    const amount = Number(formData.get("amount") ?? 0);
    const date = String(formData.get("date") ?? "");
    const description = String(formData.get("description") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();

    onAdd({
      id: Date.now(),
      type,
      amount,
      date,
      description: description || undefined,
      category: category || undefined,
    });

    form.reset();
  };

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

      <form
        onSubmit={handleSubmit}
        className="mb-5 rounded-2xl bg-[#f8fafc] p-4"
      >
        <h3 className="mb-3 text-lg font-bold">Nova transação</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <select
            required
            name="type"
            defaultValue=""
            className="rounded-lg border border-slate-300 p-3"
          >
            <option value="">Tipo</option>
            <option value="Depósito">Depósito</option>
            <option value="Transferência">Transferência</option>
          </select>
          <input
            required
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Valor"
            className="rounded-lg border border-slate-300 p-3"
          />
          <input
            required
            name="date"
            type="date"
            className="rounded-lg border border-slate-300 p-3"
          />
          <input
            name="description"
            type="text"
            placeholder="Descrição"
            className="rounded-lg border border-slate-300 p-3"
          />
          <input
            name="category"
            type="text"
            placeholder="Categoria"
            className="rounded-lg border border-slate-300 p-3"
          />
        </div>

        <button
          type="submit"
          className="mt-3 w-full rounded-lg bg-teal-900 px-4 py-3 font-bold text-white transition hover:bg-teal-950 sm:w-auto"
        >
          Concluir transação
        </button>
      </form>

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
            {transactions.map((transaction) => (
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
                  <button
                    type="button"
                    onClick={() => onDelete(transaction.id)}
                    className="rounded-md bg-[#ffecec] px-2 py-1 transition hover:bg-[#ffdede]"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">
          Nenhuma transação encontrada
        </p>
      )}
    </section>
  );
}
