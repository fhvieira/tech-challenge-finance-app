import { formatCurrency } from "@/utils/formatCurrency";

function getMonthName(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", { month: "long" });
}

export default function TransactionList({
  transactions,
  onDelete,
}: {
  transactions: { type: string; amount: number; date: string }[];
  onDelete: (index: number) => void;
}) {
    const groupedTransactions = transactions.reduce((acc, transaction) => {
    const month = getMonthName(transaction.date);

    if (!acc[month]) {
      acc[month] = [];
    }

    acc[month].push(transaction);
    return acc;
  }, {} as Record<string, { type: string; amount: number; date: string }[]>);

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
                  key={originalIndex}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span>
                    {t.type} - {formatCurrency(t.amount)}
                  </span>

                  <button onClick={() => onDelete(originalIndex)}>🗑️</button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}