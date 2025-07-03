"use client";
import { usePathname } from "next/navigation";
import { useAuth } from "../../data/useAuth"

export default function NavAside() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Enquanto carrega o user, pode mostrar algo simples ou nada
  if (loading) return null;

  // Se não tiver usuário, não mostra nada ou mostra um menu padrão vazio
  if (!user) return null;

  // Monta navItems baseado na role
  let navItems = [];

  if (user.role === "admin") {
    navItems = [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Vendas", href: "/vendas" },
      { label: "Produtos", href: "/produtos" },
      { label: "Admin", href: "/admin" },
    ];
  } else if (user.role === "vendedor") {
    navItems = [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Vendas", href: "/vendas" },
      { label: "Produtos", href: "/produtos" },
    ];
  } else if (user.role === "estoque") {
    navItems = [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Produtos", href: "/produtos" },
    ];
  }

  return (
    <nav className="mt-[80px]">
      <ul className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                className={`
                  block px-6 py-3 transition-all rounded-lg mx-2 text-[#61482a]
                  ${isActive ? "font-bold bg-[#e0d5cc]" : "text-[#61482a] hover:bg-[#e7ded7]"}
                `}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
