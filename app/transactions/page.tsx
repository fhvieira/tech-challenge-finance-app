import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import TransactionList from "../components/dashboard/TransactionList";

export default function TransactionsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f4f6f8] text-slate-900 lg:flex-row">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col gap-5 p-4 sm:p-5">
        <Header />
        <h1 className="text-xl font-bold">Transações</h1>

        {/* You can improve this later */}
      </div>

      <TransactionList
        transactions={[]}
        onDelete={() => {}}
        onEdit={() => {}}
        onView={() => {}}
        selectedTransaction={null}
      />
    </main>
  );
}