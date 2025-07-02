"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../data/firebase'; 

export default function FormLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    async function handleLogin(e) {
        e.preventDefault();
        setErro('');

        try {
            await signInWithEmailAndPassword(auth, email, senha);
            router.push('/dashboard');
        } catch (error) {
            console.error("Erro ao fazer login:", error.message);
            setErro("E-mail ou senha inválidos.");
        }
    }

    return (
        <form onSubmit={handleLogin} className="flex w-full h-full flex-col items-center justify-center gap-[20px]">
            <div className="w-full">
                <label htmlFor="email" className="text-[#61482a] text-[17px] font-semibold">E-mail</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-xl bg-[#f5efec] border-[#BFB4AE] h-[60px] px-4 outline-none focus:border-[#8d402c] focus:border-2"
                    placeholder="Digite o e-mail de login"
                />
            </div>

            <div className="w-full">
                <label htmlFor="senha" className="text-[17px] text-[#61482a] font-semibold">Senha</label>
                <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full border rounded-xl bg-[#f5efec] border-[#BFB4AE] h-[60px] px-4 outline-none focus:border-[#8d402c] focus:border-2"
                    placeholder="Digite a senha de login"
                />
            </div>

            {erro && (
                <p className="text-red-500 text-sm">{erro}</p>
            )}

            <button
                type="submit"
                className="rounded-xl w-full bg-[#8d402c] text-[#f9f5f3] h-[60px] font-bold text-[20px] mt-[20px]"
            >
                Entrar
            </button>
        </form>
    );
}
