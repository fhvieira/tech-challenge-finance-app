"use client";

import { FormEvent, Fragment } from "react";

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
  const toggleEditForm = (id: number, isHidden?: boolean) => {
    const editRow = document.getElementById(`edit-transaction-${id}`);

    if (!editRow) return;

    editRow.toggleAttribute("hidden", isHidden ?? !editRow.hasAttribute("hidden"));
  };

  const handleEditSubmit = (
    event: FormEvent<HTMLFormElement>,
    transaction: Transaction
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const type = String(formData.get("type") ?? transaction.type);
    const amount = Number(formData.get("amount") ?? transaction.amount);
    const date = String(formData.get("date") ?? transaction.date);
    const description = String(formData.get("description") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();

    onUpdate({
      ...transaction,
      type,
      amount,
      date,
      description: description || undefined,
      category: category || undefined,
    });

    toggleEditForm(transaction.id, true);
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
              <Fragment key={transaction.id}>
                <tr className="border-b">
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
                        onClick={() => toggleEditForm(transaction.id)}
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
                <tr
                  id={`edit-transaction-${transaction.id}`}
                  hidden
                  className="border-b bg-[#f8fafc]"
                >
                  <td colSpan={6} className="p-4">
                    <form
                      onSubmit={(event) => handleEditSubmit(event, transaction)}
                      className="grid gap-3 md:grid-cols-3"
                    >
                      <select
                        required
                        name="type"
                        defaultValue={transaction.type}
                        className="rounded-lg border border-slate-300 p-3"
                      >
                        <option value="Depósito">Depósito</option>
                        <option value="Transferência">Transferência</option>
                      </select>
                      <input
                        required
                        name="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        defaultValue={transaction.amount}
                        className="rounded-lg border border-slate-300 p-3"
                      />
                      <input
                        required
                        name="date"
                        type="date"
                        defaultValue={transaction.date}
                        className="rounded-lg border border-slate-300 p-3"
                      />
                      <input
                        name="description"
                        type="text"
                        defaultValue={transaction.description ?? ""}
                        placeholder="Descrição"
                        className="rounded-lg border border-slate-300 p-3"
                      />
                      <input
                        name="category"
                        type="text"
                        defaultValue={transaction.category ?? ""}
                        placeholder="Categoria"
                        className="rounded-lg border border-slate-300 p-3"
                      />
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="submit"
                          className="rounded-lg bg-teal-900 px-4 py-3 font-bold text-white transition hover:bg-teal-950"
                        >
                          Salvar alteração
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleEditForm(transaction.id, true)}
                          className="rounded-lg border border-slate-300 px-4 py-3 font-bold text-slate-700 transition hover:bg-slate-100"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              </Fragment>
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
