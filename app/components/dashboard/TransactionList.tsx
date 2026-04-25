import { formatCurrency } from "@/utils/formatCurrency";
import { Transaction } from "../../types";

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

  return (
    <aside
      style={{
        width: "300px",
        background: "#f9f9f9",
        padding: "20px",
        borderLeft: "1px solid #ddd",
      }}
    >
      <h2>Extrato</h2>

      {Object.entries(groupedTransactions).map(([month, items]) => (
        <div key={month} style={{ marginTop: "20px" }}>
          <h3 style={{ marginBottom: "10px" }}>{month}</h3>

          <ul style={{ paddingLeft: "20px" }}>
            {items.map((t) => {
              const originalIndex = transactions.indexOf(t);

              return (
                <li
                  key={t.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span>
                    {t.type} - {formatCurrency(t.amount)}
                  </span>
                  <button onClick={() => onView(t)}>👁️</button>
                  <button onClick={() => onEdit(t)}>✏️</button>
                  <button onClick={() => onDelete(t.id)}>🗑️</button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {selectedTransaction && (
        <section style={{ marginTop: "24px", padding: "12px", background: "white" }}>
          <h3>Detalhes</h3>
          <p>Tipo: {selectedTransaction.type}</p>
          <p>Valor: {formatCurrency(selectedTransaction.amount)}</p>
          <p>Data: {selectedTransaction.date}</p>
        </section>
      )}      
    </aside>
  );
}