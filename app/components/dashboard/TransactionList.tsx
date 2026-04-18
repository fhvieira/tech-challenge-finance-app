export default function TransactionList({
  transactions,
}: {
  transactions: { type: string; amount: number }[];
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
          <li key={index}>
            {t.type} - R$ {t.amount}
          </li>
        ))}
      </ul> 

      <div>
        <ul style={{ paddingLeft: "20px" }}>
          <li style={{ marginBottom: "6px" }}>Compra - R$ 36,00</li>
          <li style={{ marginBottom: "6px" }}>Compra - R$ 60,00</li>
        </ul>
      </div>
    </aside>
  );
}