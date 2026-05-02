export default function Sidebar() {
  return (
    <aside className="min-h-screen w-[220px] bg-[#0f4c5c] p-5 text-white">
      <h2 className="mb-5 text-2xl font-bold">ByteBank</h2>

      <ul className="space-y-2">
        <li className="rounded-lg bg-white/20 px-3 py-2 font-bold">
          Início
        </li>

        <li className="cursor-pointer rounded-lg px-3 py-2 transition hover:bg-white/10">
          Transferências
        </li>

        <li className="cursor-pointer rounded-lg px-3 py-2 transition hover:bg-white/10">
          Investimentos
        </li>

        <li className="cursor-pointer rounded-lg px-3 py-2 transition hover:bg-white/10">
          Outros serviços
        </li>
      </ul>
    </aside>
  );
}
