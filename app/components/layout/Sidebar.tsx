"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full bg-[#0f4c5c] p-4 text-white sm:p-5 lg:min-h-screen lg:w-[220px] lg:shrink-0">
      <h2 className="mb-4 text-2xl font-bold lg:mb-5">ByteBank</h2>

      <ul className="flex flex-wrap gap-2 lg:block lg:space-y-2">
        
        <li>
          <Link
            href="/"
            className={`block rounded-lg px-3 py-2 font-bold transition ${
              pathname === "/" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            Início
          </Link>
        </li>

        <li>
          <Link
            href="/transactions"
            className={`block rounded-lg px-3 py-2 font-bold transition ${
              pathname === "/transactions" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            Transações
          </Link>
        </li>

        <li>
          <Link
            href="#"
            className={`block rounded-lg px-3 py-2 font-bold transition ${
              pathname === "/transferencias" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            Transferências
          </Link>
        </li>

        <li>
          <Link
            href="#"
            className={`block rounded-lg px-3 py-2 font-bold transition ${
              pathname === "/investimentos" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            Investimentos
          </Link>
        </li>

        <li>
          <Link
            href="#"
            className={`block rounded-lg px-3 py-2 font-bold transition ${
              pathname === "/servicos" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            Outros serviços
          </Link>
        </li>

      </ul>
    </aside>
  );
}
