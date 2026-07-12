"use client";

import { ChangeEvent, useState } from "react";
import { Transaction } from "../../types";

const categorySuggestionsByType = {
  Depósito: ["Salário", "Freelance", "Investimentos", "Reembolso", "Outras receitas"],
  Transferência: ["Alimentação", "Moradia", "Transporte", "Saúde", "Educação", "Lazer"],
};

const maxReceiptSize = 2 * 1024 * 1024;
const acceptedReceiptTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

type NewTransactionCardProps = {
  onAdd: (t: Transaction) => void;
  onUpdate: (t: Transaction) => void;
  editingTransaction: Transaction | null;
  onCancelEdit: () => void;
};

type ValidationErrors = Partial<
  Record<"type" | "amount" | "date" | "description" | "category" | "receipt", string>
>;

function readReceipt(file: File): Promise<Transaction["receipt"]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Não foi possível ler o arquivo"));
        return;
      }

      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: reader.result,
      });
    };

    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo"));
    reader.readAsDataURL(file);
  });
}

function validateTransaction({
  type,
  amount,
  date,
  description,
  category,
  receipt,
}: {
  type: string;
  amount: string;
  date: string;
  description: string;
  category: string;
  receipt: Transaction["receipt"] | null;
}) {
  const errors: ValidationErrors = {};
  const numericAmount = Number(amount);
  const today = new Date().toISOString().split("T")[0];

  if (!type) {
    errors.type = "Selecione o tipo da transação";
  }

  if (!amount) {
    errors.amount = "Informe o valor";
  } else if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    errors.amount = "O valor deve ser maior que zero";
  } else if (!/^\d+([.,]\d{1,2})?$/.test(amount)) {
    errors.amount = "Use no máximo duas casas decimais";
  }

  if (!date) {
    errors.date = "Informe a data";
  } else if (date > today) {
    errors.date = "A data não pode ser futura";
  }

  if (description.trim().length > 80) {
    errors.description = "Use até 80 caracteres";
  }

  if (category.trim().length > 40) {
    errors.category = "Use até 40 caracteres";
  }

  if (receipt && receipt.size > maxReceiptSize) {
    errors.receipt = "O arquivo deve ter até 2 MB";
  }

  return errors;
}

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
  const [description, setDescription] = useState(
    editingTransaction?.description ?? ""
  );
  const [category, setCategory] = useState(editingTransaction?.category ?? "");
  const [receipt, setReceipt] = useState<Transaction["receipt"] | null>(
    editingTransaction?.receipt ?? null
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const categorySuggestions =
    categorySuggestionsByType[type as keyof typeof categorySuggestionsByType] ?? [];
  const categoryListId = `category-suggestions-${editingTransaction?.id ?? "new"}`;

  const clearForm = () => {
    setType("");
    setAmount("");
    setDate("");
    setDescription("");
    setCategory("");
    setReceipt(null);
    setErrors({});
  };

  const handleReceiptChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!acceptedReceiptTypes.includes(file.type)) {
      setReceipt(null);
      setErrors((currentErrors) => ({
        ...currentErrors,
        receipt: "Use PDF, JPG, PNG ou WEBP",
      }));
      return;
    }

    if (file.size > maxReceiptSize) {
      setReceipt(null);
      setErrors((currentErrors) => ({
        ...currentErrors,
        receipt: "O arquivo deve ter até 2 MB",
      }));
      return;
    }

    try {
      const nextReceipt = await readReceipt(file);
      setReceipt(nextReceipt ?? null);
      setErrors((currentErrors) => ({ ...currentErrors, receipt: undefined }));
    } catch {
      setReceipt(null);
      setErrors((currentErrors) => ({
        ...currentErrors,
        receipt: "Não foi possível anexar o arquivo",
      }));
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateTransaction({
      type,
      amount,
      date,
      description,
      category,
      receipt,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const transactionPayload = {
      type,
      amount: Number(amount),
      date,
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      receipt: receipt ?? undefined,
    };

    if (editingTransaction) {
      onUpdate({
        id: editingTransaction.id,
        ...transactionPayload,
      });
    } else {
      onAdd({
        id: Date.now(),
        ...transactionPayload,
      });
    }

    clearForm();
  };

  return (
    <form
      className="rounded-2xl bg-white p-6 shadow-md"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <h2 className="mb-[15px] text-2xl font-bold">
        {editingTransaction ? "Editar transação" : "Nova transação"}
      </h2>

      <div className="mb-3 grid gap-3 md:grid-cols-3">
        <div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-slate-300 p-3"
          >
            <option value="">Tipo</option>
            <option value="Depósito">Depósito</option>
            <option value="Transferência">Transferência</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-700">{errors.type}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Valor"
            className="w-full rounded-lg border border-slate-300 p-3"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-700">{errors.amount}</p>
          )}
        </div>

        <div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 p-3"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-700">{errors.date}</p>
          )}
        </div>
      </div>

      <div className="mb-3 grid gap-3 md:grid-cols-2">
        <div>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição"
            className="w-full rounded-lg border border-slate-300 p-3"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-700">{errors.description}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Categoria"
            list={categoryListId}
            className="w-full rounded-lg border border-slate-300 p-3"
          />
          <datalist id={categoryListId}>
            {categorySuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
          {errors.category && (
            <p className="mt-1 text-sm text-red-700">{errors.category}</p>
          )}
          {categorySuggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {categorySuggestions.slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setCategory(suggestion)}
                  className="rounded-md bg-[#eef2f3] px-2 py-1 text-sm transition hover:bg-[#dfe5e7]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-3 rounded-xl border border-dashed border-slate-300 p-3">
        <label className="block text-sm font-bold text-slate-700">
          Comprovante ou documento
        </label>
        <input
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          onChange={handleReceiptChange}
          className="mt-2 w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-[#eef2f3] file:px-3 file:py-2 file:font-bold file:text-slate-700"
        />
        <p className="mt-1 text-xs text-slate-500">PDF ou imagem, até 2 MB</p>
        {receipt && (
          <div className="mt-2 flex flex-col gap-2 rounded-lg bg-[#f8fafc] p-2 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="break-words">{receipt.name}</span>
            <button
              type="button"
              onClick={() => setReceipt(null)}
              className="rounded-md bg-[#ffecec] px-2 py-1 font-bold text-slate-700 transition hover:bg-[#ffdede]"
            >
              Remover
            </button>
          </div>
        )}
        {errors.receipt && (
          <p className="mt-1 text-sm text-red-700">{errors.receipt}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-teal-900 p-3 font-bold text-white transition hover:bg-teal-950"
      >
        {editingTransaction ? "Salvar alteração" : "Concluir transação"}
      </button>
      {editingTransaction && (
        <button
          className="mt-3 w-full rounded-lg border border-slate-300 p-3 font-bold text-slate-700 transition hover:bg-slate-100"
          type="button"
          onClick={() => {
            clearForm();
            onCancelEdit();
          }}
        >
          Cancelar edição
        </button>
      )}
    </form>
  );
}
