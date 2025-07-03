import NavAside from "./navAside";

export default function Aside({ isOpen }) {
    return (
        <aside
            className={`
                w-[250px] h-full bg-[#f5efec] border-r border-[#BFB4AE]
                fixed top-0 left-0 z-50 shadow-md
                transition-all duration-300 ease-in-out
                
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                transform
            `}
        >
        <NavAside />
        </aside>
    );
}
