import { formatCurrency } from "@/utils/formatCurrency";
import { Transaction } from "../../types";
import { formatDate } from "@/utils/formatDate";

function getMonthName(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", { month: "long" });
}

export default function TransactionList({
  transactions,
  onDelete,
  onEdit,
  onView,
  selectedTransaction
}: {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onEdit: (transaction: Transaction) => void;
  onView: (transaction: Transaction) => void;
  selectedTransaction: Transaction | null;
}) {
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
      <aside className="w-[300px] p-5">
        <h2 className="text-2xl font-bold">Extrato</h2>
        <p>Nenhuma transação ainda</p>
      </aside>
    );
  }

  return (
    <aside className="w-[320px] border-l border-[#e5e5e5] bg-white p-6 shadow-[-4px_0_12px_rgba(0,0,0,0.04)]">
      <h2 className="text-2xl font-bold">Extrato</h2>

      {Object.entries(groupedTransactions).map(([month, items]) => (
        <div key={month} className="mt-5">
          <h3 className="mb-2.5 font-bold">{month}</h3>

          <ul className="pl-5">
            {items.map((t) => {
              return (
                <li
                  key={t.id}
                  className="mb-2.5 flex items-center justify-between border-b border-[#eee] pb-2"
                >
                  <span>
                    {t.type} - {formatCurrency(t.amount)}
                  </span>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => onView(t)}
                      className="rounded-md bg-[#eef2f3] px-1.5 py-1 transition hover:bg-[#dfe5e7]"
                    >
                      👁️
                    </button>

                    <button
                      onClick={() => onEdit(t)}
                      className="rounded-md bg-[#eef2f3] px-1.5 py-1 transition hover:bg-[#dfe5e7]"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => onDelete(t.id)}
                      className="rounded-md bg-[#ffecec] px-1.5 py-1 transition hover:bg-[#dfe5e7]"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {selectedTransaction && (
        <section className="mt-6 bg-white p-3">
          <h3 className="font-bold">Detalhes</h3>
          <p>Tipo: {selectedTransaction.type}</p>
          <p>Valor: {formatCurrency(selectedTransaction.amount)}</p>
          <p>{formatDate(selectedTransaction.date)}</p>
        </section>
      )}      
    </aside>
  );
}
