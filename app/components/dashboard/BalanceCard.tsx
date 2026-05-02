import { formatCurrency } from "@/utils/formatCurrency";

export default function BalanceCard({ balance }: { balance: number }) {
  return (
    <section
      style={{
        background: "#0f4c5c",
        color: "white",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        transition: "0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <h2 style={{ marginBottom: "10px" }}>Olá, Joana! :)</h2>
      <p style={{ opacity: 0.8 }}>Saldo</p>
      <h1 style={{ fontSize: "32px", marginTop: "5px" }}>{formatCurrency(balance)}</h1>
    </section>  
  );
}
