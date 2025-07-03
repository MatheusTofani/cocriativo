export default function Header({ toggleMenu }) {
    return (
        <header className="w-full h-[80px] bg-[#f5efec] border-b border-[#BFB4AE] flex items-center justify-center relative px-6 md:px-12 fixed top-0 left-0">
            <div onClick={toggleMenu} className="z-50 absolute left-6 md:left-12 top-1/2 -translate-y-1/2 h-[25px] w-[30px] flex flex-col items-center justify-between cursor-pointer">
                <span className="h-[3px] w-full rounded bg-[#8d402c]"></span>
                <span className="h-[3px] w-full rounded bg-[#8d402c]"></span>
                <span className="h-[3px] w-full rounded bg-[#8d402c]"></span>
            </div>

            <img src="/simbolo.png" alt="Logo Co-Criativo" className="h-[50px]" />
        </header>
    );
}
