"use client";
import { usePathname } from "next/navigation";

export default function NavAside() {
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Vendas", href: "/vendas" },
        { label: "Produtos", href: "/produtos" },
    ];


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
    )
}