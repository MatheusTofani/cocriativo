"use client";
import { useState } from "react";
import { db } from "../../data/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ProdutosModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [marca, setMarca] = useState("");
    const [estoque, setEstoque] = useState("");
    const [observacao, setObservacao] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        const produto = {
            nome,
            preco: Number(preco),
            marca,
            criadoEm: serverTimestamp(),
        };

        if (estoque !== "") {
            produto.estoque = Number(estoque);
        }

        if (observacao.trim() !== "") {
            produto.observacao = observacao.trim();
        }

        try {
            await addDoc(collection(db, "produtos"), produto);

            // limpar inputs e fechar
            setNome("");
            setPreco("");
            setMarca("");
            setEstoque("");
            setObservacao("");
            setIsOpen(false);
        } catch (error) {
            console.error("Erro ao salvar produto:", error);
        }
    }

    const marcasDisponiveis = [
        "Open House",
        "Visionaire",
        "Jaqueline Braga",
        "Art Tábuas",
        "DP Semijoias",
        "Datiza Velas Aromáticas",
        "Francine Moreira",
    ];


    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="rounded-xl w-full bg-[#8d402c] text-[#f9f5f3] h-[60px] font-bold text-[20px]"
            >
                Cadastrar Produto
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050]"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-[#f9f5f3] w-[90%] max-w-[500px] rounded-xl p-6 relative shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-3 text-[#8d402c] text-2xl font-bold"
                        >
                            ×
                        </button>

                        <h2 className="text-xl font-bold text-[#8d402c] mb-4">
                            Cadastrar Produto
                        </h2>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Nome do produto"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                                className="w-full border rounded-xl bg-[#f5efec] border-[#BFB4AE] h-[60px] px-4 outline-none focus:border-[#8d402c] focus:border-2"
                            />
                            <input
                                type="number"
                                placeholder="Preço sugerido"
                                value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                                required
                                className="w-full border rounded-xl bg-[#f5efec] border-[#BFB4AE] h-[60px] px-4 outline-none focus:border-[#8d402c] focus:border-2"
                            />
                            <select
                                value={marca}
                                onChange={(e) => setMarca(e.target.value)}
                                required
                                className="w-full border rounded-xl bg-[#f5efec] border-[#BFB4AE] h-[60px] px-4 outline-none text-[#61482a] focus:border-[#8d402c] focus:border-2"
                            >
                                <option value="" disabled>
                                    Selecione a marca
                                </option>
                                <option value="Open House">Open House</option>
                                <option value="Visionaire">Visionaire</option>
                                <option value="Jaqueline Braga">Jaqueline Braga</option>
                                <option value="Art Tábuas">Art Tábuas</option>
                                <option value="DP Semijoias">DP Semijoias</option>
                                <option value="Datiza Velas Aromáticas">Datiza Velas Aromáticas</option>
                                <option value="Francine Moreira">Francine Moreira</option>
                            </select>

                            <input
                                type="number"
                                placeholder="Estoque (opcional)"
                                value={estoque}
                                onChange={(e) => setEstoque(e.target.value)}
                                className="w-full border rounded-xl bg-[#f5efec] border-[#BFB4AE] h-[60px] px-4 outline-none focus:border-[#8d402c] focus:border-2"
                            />
                            <textarea
                                placeholder="Observação (opcional)"
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                                rows={3}
                                className="w-full border rounded-xl bg-[#f5efec] border-[#BFB4AE] px-4 py-3 outline-none resize-none focus:border-[#8d402c] focus:border-2"
                            />
                            <button
                                type="submit"
                                className="rounded-xl w-full bg-[#8d402c] text-[#f9f5f3] h-[60px] font-bold text-[20px]"
                            >
                                Salvar Produto
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
