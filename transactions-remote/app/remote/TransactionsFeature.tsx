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

const pageSize = 5;

function getRootElement() {
  return document.getElementById("transactions-remote-feature");
}

function getInputValue(root: HTMLElement, name: string) {
  const input = root.querySelector<HTMLInputElement | HTMLSelectElement>(
    `[name="${name}"]`
  );

  return input?.value ?? "";
}

function getTransactionRows(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLTableRowElement>("[data-transaction-row]")
  );
}

function hideEditRows(root: HTMLElement) {
  root
    .querySelectorAll<HTMLTableRowElement>("[data-edit-row]")
    .forEach((row) => {
      row.hidden = true;
    });
}

function getFilteredRows(root: HTMLElement) {
  const search = getInputValue(root, "search").trim().toLowerCase();
  const typeFilter = getInputValue(root, "typeFilter");
  const categoryFilter = getInputValue(root, "categoryFilter");
  const startDate = getInputValue(root, "startDate");
  const endDate = getInputValue(root, "endDate");

  return getTransactionRows(root).filter((row) => {
    const description = row.dataset.description ?? "";
    const category = row.dataset.category ?? "";
    const type = row.dataset.type ?? "";
    const date = row.dataset.date ?? "";
    const matchesSearch =
      search === "" ||
      description.includes(search) ||
      category.toLowerCase().includes(search);
    const matchesType = typeFilter === "all" || type === typeFilter;
    const matchesCategory =
      categoryFilter === "all" || category === categoryFilter;
    const matchesStartDate = startDate === "" || date >= startDate;
    const matchesEndDate = endDate === "" || date <= endDate;

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      matchesStartDate &&
      matchesEndDate
    );
  });
}

function renderFilteredPage(nextPage?: number) {
  const root = getRootElement();

  if (!root) return;

  const filteredRows = getFilteredRows(root);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const requestedPage = nextPage ?? Number(root.dataset.currentPage ?? "1");
  const activePage = Math.min(Math.max(1, requestedPage), totalPages);
  const pageStart = (activePage - 1) * pageSize;
  const pageEnd = activePage * pageSize;
  const filteredRowSet = new Set(filteredRows);

  root.dataset.currentPage = String(activePage);
  hideEditRows(root);

  getTransactionRows(root).forEach((row) => {
    const filteredIndex = filteredRows.indexOf(row);
    row.hidden =
      !filteredRowSet.has(row) ||
      filteredIndex < pageStart ||
      filteredIndex >= pageEnd;
  });

  const emptyFiltersMessage = root.querySelector<HTMLElement>(
    "[data-empty-filters-message]"
  );
  const pagination = root.querySelector<HTMLElement>("[data-pagination]");
  const count = root.querySelector<HTMLElement>("[data-pagination-count]");
  const pageIndicator = root.querySelector<HTMLElement>("[data-page-indicator]");
  const previousButton = root.querySelector<HTMLButtonElement>(
    "[data-previous-page]"
  );
  const nextButton = root.querySelector<HTMLButtonElement>("[data-next-page]");

  if (emptyFiltersMessage) {
    emptyFiltersMessage.hidden = filteredRows.length > 0;
  }

  if (pagination) {
    pagination.hidden = filteredRows.length === 0;
  }

  if (count) {
    const visibleCount = filteredRows.slice(pageStart, pageEnd).length;
    count.textContent = `Mostrando ${visibleCount} de ${filteredRows.length} transações`;
  }

  if (pageIndicator) {
    pageIndicator.textContent = `${activePage} / ${totalPages}`;
  }

  if (previousButton) {
    previousButton.disabled = activePage === 1;
  }

  if (nextButton) {
    nextButton.disabled = activePage === totalPages;
  }
}

function resetFiltersPage() {
  renderFilteredPage(1);
}

function goToRelativePage(offset: number) {
  const root = getRootElement();

  if (!root) return;

  renderFilteredPage(Number(root.dataset.currentPage ?? "1") + offset);
}

export default function TransactionsFeature({
  transactions,
  onDelete,
  onUpdate,
}: TransactionsFeatureProps) {
  const typeOptions = Array.from(
    new Set(transactions.map((transaction) => transaction.type))
  );
  const categoryOptions = Array.from(
    new Set(
      transactions.map(
        (transaction) => transaction.category?.trim() || "Sem categoria"
      )
    )
  );
  const initialRows = transactions.slice(0, pageSize);
  const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));

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
    <section
      id="transactions-remote-feature"
      data-current-page="1"
      className="rounded-2xl bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Transações</h2>
          <p className="text-sm text-slate-500">Remote via Module Federation</p>
        </div>
        <span className="rounded-md bg-[#eef2f3] px-2 py-1 text-sm font-bold text-slate-700">
          transactionsRemote
        </span>
      </div>

      {transactions.length > 0 && (
        <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <input
            type="search"
            name="search"
            onChange={resetFiltersPage}
            placeholder="Buscar descrição ou categoria"
            className="rounded-lg border border-slate-300 p-3"
          />

          <select
            name="typeFilter"
            defaultValue="all"
            onChange={resetFiltersPage}
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
            name="categoryFilter"
            defaultValue="all"
            onChange={resetFiltersPage}
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
            name="startDate"
            onChange={resetFiltersPage}
            className="rounded-lg border border-slate-300 p-3"
            aria-label="Data inicial"
          />

          <input
            type="date"
            name="endDate"
            onChange={resetFiltersPage}
            className="rounded-lg border border-slate-300 p-3"
            aria-label="Data final"
          />
        </div>
      )}

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
                <tr
                  hidden={!initialRows.includes(transaction)}
                  data-transaction-row
                  data-description={(transaction.description ?? "").toLowerCase()}
                  data-category={transaction.category?.trim() || "Sem categoria"}
                  data-type={transaction.type}
                  data-date={transaction.date}
                  className="border-b"
                >
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
                  data-edit-row
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

      {transactions.length > 0 && (
        <p data-empty-filters-message hidden className="mt-4 text-sm text-slate-500">
          Nenhuma transação encontrada com os filtros selecionados
        </p>
      )}

      {transactions.length > 0 && (
        <div
          data-pagination
          className="mt-4 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between"
        >
          <span data-pagination-count>
            Mostrando {initialRows.length} de {transactions.length} transações
          </span>

          <div className="flex items-center gap-2">
            <button
              data-previous-page
              type="button"
              onClick={() => goToRelativePage(-1)}
              disabled
              className="rounded-md bg-[#eef2f3] px-3 py-2 font-bold text-slate-700 transition hover:bg-[#dfe5e7] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            <span data-page-indicator className="font-medium">
              1 / {totalPages}
            </span>

            <button
              data-next-page
              type="button"
              onClick={() => goToRelativePage(1)}
              disabled={totalPages === 1}
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
