import { formatCurrency } from "@/utils/formatCurrency";
import { Transaction } from "../../types";
import { formatDate } from "@/utils/formatDate";

function getMonthName(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", { month: "long" });
}

type TransactionListProps = {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onEdit: (transaction: Transaction) => void;
  onView?: (transaction: Transaction) => void;
  selectedTransaction?: Transaction | null;
};

export default function TransactionList({
  transactions,
  onDelete,
  onEdit,
  onView,
  selectedTransaction,
}: TransactionListProps) {
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const month = getMonthName(transaction.date);

    if (!acc[month]) {
      acc[month] = [];
    }

    acc[month].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);  

  if (transactions.length === 0) {
    return (
      <aside className="w-full p-4 sm:p-5 lg:w-[300px] lg:shrink-0">
        <h2 className="text-2xl font-bold">Extrato</h2>
      </aside>
    );
  }

  return (
    <aside className="w-full border-t border-[#e5e5e5] bg-white p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] sm:p-6 lg:w-[320px] lg:shrink-0 lg:border-l lg:border-t-0 lg:shadow-[-4px_0_12px_rgba(0,0,0,0.04)]">
      <h2 className="text-2xl font-bold">Extrato</h2>

      {Object.entries(groupedTransactions).map(([month, items]) => (
        <div key={month} className="mt-5">
          <h3 className="mb-2.5 font-bold capitalize">{month}</h3>

          <ul className="pl-0 sm:pl-5">
            {items.map((transaction) => (
              <li
                key={transaction.id}
                className="mb-2.5 flex flex-col gap-2 border-b border-[#eee] pb-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 break-words">
                  <p>
                    {transaction.type} - {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatDate(transaction.date)}
                  </p>
                </div>

                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => onView?.(transaction)}
                    className="rounded-md bg-[#eef2f3] px-1.5 py-1 transition hover:bg-[#dfe5e7]"
                    aria-label="Visualizar detalhes"
                  >
                    👁
                  </button>

                  <button
                    onClick={() => onEdit(transaction)}
                    className="rounded-md bg-[#eef2f3] px-1.5 py-1 transition hover:bg-[#dfe5e7]"
                    aria-label="Editar"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="rounded-md bg-[#ffecec] px-1.5 py-1 transition hover:bg-[#ffdede]"
                    aria-label="Excluir"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {selectedTransaction && (
        <section className="mt-6 rounded-xl bg-[#f8fafc] p-3">
          <h3 className="font-bold">Detalhes</h3>
          <p>Tipo: {selectedTransaction.type}</p>
          <p>Valor: {formatCurrency(selectedTransaction.amount)}</p>
          <p>Data: {formatDate(selectedTransaction.date)}</p>
        </section>
      )}
    </aside>
  );
}