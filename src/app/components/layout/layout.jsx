"use client";
import { useState } from "react";
import Header from "./header";
import Aside from "./aside";

export default function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const closeMenu = () => setIsMenuOpen(false);
    return (

        <div className="flex">
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40"
                    onClick={closeMenu}
                />
            )}
            <Aside isOpen={isMenuOpen} />
            <Header toggleMenu={toggleMenu} />
        </div>
    );
}
