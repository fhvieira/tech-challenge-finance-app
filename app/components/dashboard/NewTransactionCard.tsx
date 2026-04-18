import { useState } from "react";

export default function NewTransactionCard({
  onAdd,
}: {
  onAdd: (t: { type: string; amount: number }) => void;
}) {
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <section
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "12px",
      }}
    >   
      <h2 style={{ marginBottom: "15px" }}>Nova transação</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ flex: 1 }}
        >
          <option value="">Tipo</option>
          <option value="Depósito">Depósito</option>
          <option value="Transferência">Transferência</option>
        </select>

        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Valor"
          style={{ flex: 1 }}
        />  
      </div>

      <button
        style={{
          width: "100%",
          padding: "12px",
          background: "#0f4c5c",
          color: "white",
          border: "none",
          borderRadius: "6px",
        }}
        onClick={() => {
          if (!type || !amount) return;

          onAdd({
            type,
            amount: Number(amount),
          });

          setType("");
          setAmount("");
        }}
      >
        Concluir transação
      </button>
    </section>
  );
}