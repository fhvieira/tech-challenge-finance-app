import { formatCurrency } from "@/utils/formatCurrency";

export default function TransactionList({
  transactions,
  onDelete,
}: {
  transactions: { type: string; amount: number }[];
  onDelete: (index: number) => void;
}) {
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

      <ul style={{ paddingLeft: "20px" }}>
        {transactions.map((t, index) => (
          <li
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span>
              {t.type} - {formatCurrency(t.amount)}
            </span>
            <button onClick={() => onDelete(index)} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}