import { formatCurrency } from "@/utils/formatCurrency";

export default function BalanceCard({ balance }: { balance: number }) {
  return (
    <section className="rounded-2xl bg-[#0f4c5c] p-6 text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition duration-200 hover:-translate-y-0.5">
      <h2 className="mb-2.5">Olá, Joana! :)</h2>
      <p className="opacity-80">Saldo</p>
      <h1 className="mt-1 text-3xl font-bold">{formatCurrency(balance)}</h1>
    </section>  
  );
}
