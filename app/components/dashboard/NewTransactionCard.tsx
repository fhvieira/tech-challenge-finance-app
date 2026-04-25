import { useEffect, useState } from "react";
import { Transaction } from "../../types";

export default function NewTransactionCard({
  onAdd,
  onUpdate,
  editingTransaction,
  onCancelEdit
}: {
  onAdd: (t: Transaction) => void;
  onUpdate: (t: Transaction) => void;
  editingTransaction: Transaction | null;
  onCancelEdit: () => void;
}) {
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(String(editingTransaction.amount));
      setDate(editingTransaction.date);
    }
  }, [editingTransaction]);

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

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: "100%", padding: "10px" }}
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
          if (!type || !amount || !date) return;

          if (editingTransaction) {
            onUpdate({
              id: editingTransaction.id,
              type,
              amount: Number(amount),
              date,
            });
          } else {
            onAdd({ 
              id: Date.now(),
              type,
              amount: Number(amount),
              date,
            });
          }

          setType("");
          setAmount("");
          setDate("");
        }}
      >
        {editingTransaction ? "Salvar alteração" : "Concluir transação"}
      </button>
      {editingTransaction && (
        <button
          style={{
            width: "100%",
            padding: "12px",
            background: "#0f4c5c",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
          type="button"
          onClick={() => {
            setType("");
            setAmount("");
            setDate("");
            onCancelEdit();
          }}
        >
          Cancelar edição
        </button>
      )}
    </section>
  );
}