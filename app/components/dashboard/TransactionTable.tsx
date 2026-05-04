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

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left text-slate-600">
              <th className="py-3 pr-4">Tipo</th>
              <th className="py-3 pr-4">Data</th>
              <th className="py-3 pr-4 text-right">Valor</th>
              <th className="py-3 text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b last:border-b-0">
                <td className="py-3 pr-4">{transaction.type}</td>
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
    </section>
  );
}