"use client";

import { useMemo, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { Transaction } from "../../types";

type TransactionTableProps = {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onEdit: (transaction: Transaction) => void;
};

export default function TransactionTable({
  transactions,
  onDelete,
  onEdit,
}: TransactionTableProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  const typeOptions = useMemo(
    () => Array.from(new Set(transactions.map((transaction) => transaction.type))),
    [transactions]
  );

  const categoryOptions = useMemo(() => {
    const categories = transactions.map((transaction) =>
      transaction.category?.trim() || "Sem categoria"
    );

    return Array.from(new Set(categories));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const transactionCategory = transaction.category?.trim() || "Sem categoria";
      const description = transaction.description?.toLowerCase() || "";
      const category = transactionCategory.toLowerCase();
      const matchesSearch =
        normalizedSearch === "" ||
        description.includes(normalizedSearch) ||
        category.includes(normalizedSearch);
      const matchesType = typeFilter === "all" || transaction.type === typeFilter;
      const matchesCategory =
        categoryFilter === "all" || transactionCategory === categoryFilter;
      const matchesStartDate = startDate === "" || transaction.date >= startDate;
      const matchesEndDate = endDate === "" || transaction.date <= endDate;

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [categoryFilter, endDate, search, startDate, transactions, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const paginatedTransactions = filteredTransactions.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize
  );

  const resetPage = () => {
    setCurrentPage(1);
  };

  if (transactions.length === 0) {
    return (
      <section className="w-full rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-bold">Transações</h2>
        <p className="mt-3 text-sm text-slate-500">Nenhuma transação ainda</p>
      </section>
    );
  }

  return (
    <section className="w-full rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold">Transações</h2>

      <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            resetPage();
          }}
          placeholder="Buscar descrição ou categoria"
          className="rounded-lg border border-slate-300 p-3"
        />

        <select
          value={typeFilter}
          onChange={(event) => {
            setTypeFilter(event.target.value);
            resetPage();
          }}
          className="rounded-lg border border-slate-300 p-3"
        >
          <option value="all">Todos os tipos</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(event) => {
            setCategoryFilter(event.target.value);
            resetPage();
          }}
          className="rounded-lg border border-slate-300 p-3"
        >
          <option value="all">Todas as categorias</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(event) => {
            setStartDate(event.target.value);
            resetPage();
          }}
          className="rounded-lg border border-slate-300 p-3"
          aria-label="Data inicial"
        />

        <input
          type="date"
          value={endDate}
          onChange={(event) => {
            setEndDate(event.target.value);
            resetPage();
          }}
          className="rounded-lg border border-slate-300 p-3"
          aria-label="Data final"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left text-slate-600">
              <th className="py-3 pr-4">Tipo</th>
              <th className="py-3 pr-4">Descrição</th>
              <th className="py-3 pr-4">Categoria</th>
              <th className="py-3 pr-4">Documento</th>
              <th className="py-3 pr-4">Data</th>
              <th className="py-3 pr-4 text-right">Valor</th>
              <th className="py-3 text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            {paginatedTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b last:border-b-0">
                <td className="py-3 pr-4">{transaction.type}</td>
                <td className="py-3 pr-4">
                  {transaction.description?.trim() || "-"}
                </td>
                <td className="py-3 pr-4">
                  {transaction.category?.trim() || "Sem categoria"}
                </td>
                <td className="py-3 pr-4">
                  {transaction.receipt ? (
                    <a
                      href={transaction.receipt.dataUrl}
                      download={transaction.receipt.name}
                      className="font-bold text-[#0f4c5c] hover:underline"
                    >
                      Ver
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-3 pr-4">{formatDate(transaction.date)}</td>
                <td className="py-3 pr-4 text-right font-medium">
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="rounded-md bg-[#eef2f3] px-2 py-1 transition hover:bg-[#dfe5e7]"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="rounded-md bg-[#ffecec] px-2 py-1 transition hover:bg-[#ffdede]"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          Nenhuma transação encontrada com os filtros selecionados
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Mostrando {paginatedTransactions.length} de{" "}
            {filteredTransactions.length} transações
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={activePage === 1}
              className="rounded-md bg-[#eef2f3] px-3 py-2 font-bold text-slate-700 transition hover:bg-[#dfe5e7] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="font-medium">
              {activePage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={activePage === totalPages}
              className="rounded-md bg-[#eef2f3] px-3 py-2 font-bold text-slate-700 transition hover:bg-[#dfe5e7] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
