export default function Sidebar() {
  return (
    <aside className="w-full bg-[#0f4c5c] p-4 text-white sm:p-5 lg:min-h-screen lg:w-[220px] lg:shrink-0">
      <h2 className="mb-4 text-2xl font-bold lg:mb-5">ByteBank</h2>

      <ul className="flex flex-wrap gap-2 lg:block lg:space-y-2">
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
