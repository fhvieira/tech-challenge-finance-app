import { formatCurrency } from "@/utils/formatCurrency";

export default function BalanceCard({ balance }: { balance: number }) {
  return (
    <section
      style={{
        background: "#0f4c5c",
        color: "white",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>Olá, Joana! :)</h2>
      <p style={{ opacity: 0.8 }}>Saldo</p>
      <h1 style={{ fontSize: "32px", marginTop: "5px" }}>{formatCurrency(balance)}</h1>
    </section>  
  );
}
