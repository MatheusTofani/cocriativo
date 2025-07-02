"use client";
import { useState, useEffect } from "react";
import { db } from "../../data/firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

export default function VendaModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [buscaProduto, setBuscaProduto] = useState("");

    const [quantidade, setQuantidade] = useState("");
    const [valorVenda, setValorVenda] = useState("");
    const [formaPagamento, setFormaPagamento] = useState("pix");
    const [parcelas, setParcelas] = useState("1");

    const taxas = {
        debito: 0.0137,
        credito: {
            "1": 0.0315,
            "2": 0.0539,
            "3": 0.0612,
            "4": 0.0685,
            "5": 0.0757,
        },
        pix: 0,
        dinheiro: 0,
    };

    const valorLiquido = (() => {
        const valor = parseFloat(valorVenda) || 0;

        if (formaPagamento === "credito") {
            return valor - valor * (taxas.credito[parcelas] || 0);
        }
        return valor - valor * (taxas[formaPagamento] || 0);
    })();

    useEffect(() => {
        async function fetchProdutos() {
            const snap = await getDocs(collection(db, "produtos"));
            const lista = snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProdutos(lista);
        }
        fetchProdutos();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!produtoSelecionado || !quantidade || !valorVenda) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        const venda = {
            produtoId: produtoSelecionado.id,
            produtoNome: produtoSelecionado.nome,
            quantidade: Number(quantidade),
            valorVenda: Number(valorVenda),
            valorLiquido: Number(valorLiquido.toFixed(2)),
            formaPagamento,
            parcelas: formaPagamento === "credito" ? Number(parcelas) : null,
            criadoEm: serverTimestamp(),
        };

        await addDoc(collection(db, "vendas"), venda);

        // Reset
        setProdutoSelecionado(null);
        setQuantidade("");
        setValorVenda("");
        setFormaPagamento("pix");
        setParcelas("1");
        setBuscaProduto("");
        setIsOpen(false);
    }

    const produtosFiltrados = produtos.filter((p, i) => {
        const termo = buscaProduto.toLowerCase();
        return (
            p.nome.toLowerCase().includes(termo) ||
            (i + 1).toString().includes(termo)
        );
    });

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="rounded-xl w-full bg-[#8d402c] text-white h-[60px] font-bold text-[20px]"
            >
                Registrar Venda
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050]"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-white w-[90%] max-w-[600px] rounded-xl p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-3 text-[#8d402c] text-2xl font-bold"
                        >
                            ×
                        </button>

                        <h2 className="text-xl font-bold text-[#8d402c] mb-4">
                            Registrar Venda
                        </h2>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Buscar produto por nome ou ID"
                                value={buscaProduto}
                                onChange={(e) => setBuscaProduto(e.target.value)}
                                className="border rounded-xl h-[50px] px-4 bg-[#f5efec] border-[#BFB4AE] outline-none"
                            />

                            <select
                                value={produtoSelecionado?.id || ""}
                                onChange={(e) => {
                                    const produto = produtos.find(p => p.id === e.target.value);
                                    setProdutoSelecionado(produto || null);
                                }}
                                className="border rounded-xl h-[50px] px-4 bg-[#f5efec] border-[#BFB4AE] outline-none text-[#61482a]"
                            >
                                <option value="" disabled>
                                    Selecione um produto
                                </option>
                                {produtosFiltrados.map((produto, i) => (
                                    <option key={produto.id} value={produto.id}>
                                        {`${i + 1} - ${produto.nome}`}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                placeholder="Quantidade"
                                value={quantidade}
                                onChange={(e) => setQuantidade(e.target.value)}
                                className="border rounded-xl h-[50px] px-4 bg-[#f5efec] border-[#BFB4AE] outline-none"
                            />

                            <input
                                type="number"
                                step="0.01"
                                placeholder="Valor da venda (R$)"
                                value={valorVenda}
                                onChange={(e) => setValorVenda(e.target.value)}
                                className="border rounded-xl h-[50px] px-4 bg-[#f5efec] border-[#BFB4AE] outline-none"
                            />

                            <select
                                value={formaPagamento}
                                onChange={(e) => setFormaPagamento(e.target.value)}
                                className="border rounded-xl h-[50px] px-4 bg-[#f5efec] border-[#BFB4AE] outline-none"
                            >
                                <option value="pix">Pix</option>
                                <option value="dinheiro">Dinheiro</option>
                                <option value="debito">Débito</option>
                                <option value="credito">Crédito</option>
                            </select>

                            {formaPagamento === "credito" && (
                                <select
                                    value={parcelas}
                                    onChange={(e) => setParcelas(e.target.value)}
                                    className="border rounded-xl h-[50px] px-4 bg-[#f5efec] border-[#BFB4AE] outline-none"
                                >
                                    <option value="1">1x</option>
                                    <option value="2">2x</option>
                                    <option value="3">3x</option>
                                    <option value="4">4x</option>
                                    <option value="5">5x</option>
                                </select>
                            )}

                            <div className="text-right font-semibold text-[#61482a]">
                                Valor líquido: R$ {valorLiquido.toFixed(2)}
                            </div>

                            <button
                                type="submit"
                                className="rounded-xl w-full bg-[#8d402c] text-white h-[60px] font-bold text-[20px]"
                            >
                                Confirmar Venda
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
