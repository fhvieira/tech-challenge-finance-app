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
    <section className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-[15px] text-2xl font-bold">Nova transação</h2>
      <div className="mb-2.5 flex gap-2.5">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 p-3"
        >
          <option value="">Tipo</option>
          <option value="Depósito">Depósito</option>
          <option value="Transferência">Transferência</option>
        </select>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Valor"
          className="flex-1 rounded-lg border border-slate-300 p-3"
        />  
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 p-3"
          />
      </div>

      <button
        className="w-full rounded-lg bg-teal-900 p-3 font-bold text-white transition hover:bg-teal-950"
        onClick={() => {
          if (!type || !amount || !date) {
            alert("Preencha todos os campos");
            return;
          }

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
          className="w-full rounded-lg bg-teal-900 p-3 font-bold text-white transition hover:bg-teal-950"
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
