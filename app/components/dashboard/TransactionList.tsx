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
      <aside style={{ width: "300px", padding: "20px" }}>
        <h2>Extrato</h2>
        <p>Nenhuma transação ainda</p>
      </aside>
    );
  }

  return (
    <aside
      style={{
        width: "320px",
        background: "white",
        padding: "24px",
        borderLeft: "1px solid #e5e5e5",
        boxShadow: "-4px 0 12px rgba(0,0,0,0.04)",
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
                    alignItems: "center",
                    marginBottom: "10px",
                    paddingBottom: "8px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <span>
                    {t.type} - {formatCurrency(t.amount)}
                  </span>
                  
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => onView(t)}
                      style={{
                        border: "none",
                        background: "#eef2f3",
                        borderRadius: "6px",
                        padding: "4px 6px",
                        cursor: "pointer",
                        transition: "0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#dfe5e7")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#eef2f3")}
                    >
                      👁️
                    </button>

                    <button
                      onClick={() => onEdit(t)}
                      style={{
                        border: "none",
                        background: "#eef2f3",
                        borderRadius: "6px",
                        padding: "4px 6px",
                        cursor: "pointer",
                        transition: "0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#dfe5e7")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#eef2f3")}
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => onDelete(t.id)}
                      style={{
                        border: "none",
                        background: "#ffecec",
                        borderRadius: "6px",
                        padding: "4px 6px",
                        cursor: "pointer",
                        transition: "0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#dfe5e7")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#ffecec")}
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
        <section style={{ marginTop: "24px", padding: "12px", background: "white" }}>
          <h3>Detalhes</h3>
          <p>Tipo: {selectedTransaction.type}</p>
          <p>Valor: {formatCurrency(selectedTransaction.amount)}</p>
          <p>{formatDate(selectedTransaction.date)}</p>
        </section>
      )}      
    </aside>
  );
}