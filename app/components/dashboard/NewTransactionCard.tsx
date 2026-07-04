import { useState } from "react";
import { Transaction } from "../../types";

type NewTransactionCardProps = {
  onAdd: (t: Transaction) => void;
  onUpdate: (t: Transaction) => void;
  editingTransaction: Transaction | null;
  onCancelEdit: () => void;
};

export default function NewTransactionCard(props: NewTransactionCardProps) {
  return (
    <NewTransactionForm
      key={props.editingTransaction?.id ?? "new"}
      {...props}
    />
  );
}

function NewTransactionForm({
  onAdd,
  onUpdate,
  editingTransaction,
  onCancelEdit,
}: NewTransactionCardProps) {
  const [type, setType] = useState(editingTransaction?.type ?? "");
  const [amount, setAmount] = useState(
    editingTransaction ? String(editingTransaction.amount) : ""
  );
  const [date, setDate] = useState(editingTransaction?.date ?? "");

  return (
    <section className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-[15px] text-2xl font-bold">Nova transação</h2>
      <div className="mb-3 flex flex-col gap-3 md:flex-row">
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
          className="mt-3 w-full rounded-lg border border-slate-300 p-3 font-bold text-slate-700 transition hover:bg-slate-100"
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
