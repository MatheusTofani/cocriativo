"use client";
import { useEffect, useState } from "react";
import { db } from "../../data/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function EditarVendaModal({ venda, onClose, onAtualizar }) {
    const [produtos, setProdutos] = useState([]);
    const [produtoId, setProdutoId] = useState(venda.produtoId || "");
    const [buscaProduto, setBuscaProduto] = useState("");
    const [valor, setValor] = useState(venda.valor?.toFixed(2) || "");
    const [quantidade, setQuantidade] = useState(venda.quantidade || "");
    const [pagamento, setPagamento] = useState(venda.pagamento || "debito");
    const [parcelas, setParcelas] = useState(venda.parcelas || 1);
    const [valorLiquido, setValorLiquido] = useState(0);

    const taxas = {
        debito: 1.37,
        credito: {
            1: 3.15,
            2: 5.39,
            3: 6.12,
            4: 6.85,
            5: 7.57,
        },
        pix: 0,
        dinheiro: 0,
    };

    useEffect(() => {
        async function fetchProdutos() {
            const snapshot = await getDocs(collection(db, "produtos"));
            const lista = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProdutos(lista);
        }

        fetchProdutos();
    }, []);

    useEffect(() => {
        const total = Number(valor || 0) * Number(quantidade || 1);
        let taxa = 0;

        if (pagamento === "credito") {
            taxa = taxas.credito[parcelas] || 0;
        } else if (pagamento === "debito") {
            taxa = taxas.debito;
        }

        const liquido = total - (total * taxa) / 100;
        setValorLiquido(liquido);
    }, [valor, quantidade, pagamento, parcelas]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const ref = doc(db, "vendas", venda.idFirebase);
            await updateDoc(ref, {
                produtoId,
                valor: Number(valor),
                quantidade: Number(quantidade),
                pagamento,
                parcelas: pagamento === "credito" ? Number(parcelas) : null,
                valorLiquido,
            });

            onClose();
            onAtualizar();
        } catch (error) {
            console.error("Erro ao atualizar venda:", error);
        }
    }

    const produtosFiltrados = produtos.filter((p) => {
        const busca = buscaProduto.toLowerCase();
        return (
            p.nome.toLowerCase().includes(busca) ||
            p.id.toLowerCase().includes(busca)
        );
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050]" onClick={onClose}>
            <div className="bg-white p-6 rounded-xl max-w-md w-[95%]" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-[#8d402c] mb-4">Editar Venda</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            placeholder="Buscar produto por nome ou ID"
                            value={buscaProduto}
                            onChange={(e) => setBuscaProduto(e.target.value)}
                            className="w-full mb-2 border border-[#BFB4AE] rounded-xl px-4 h-[50px] bg-[#f5efec] outline-none"
                        />
                        <select
                            value={produtoId}
                            onChange={(e) => setProdutoId(e.target.value)}
                            required
                            className="w-full border border-[#BFB4AE] rounded-xl px-4 h-[50px] bg-[#f5efec] outline-none text-[#61482a]"
                        >
                            <option value="" disabled>Selecione o produto</option>
                            {produtosFiltrados.map((produto) => (
                                <option key={produto.id} value={produto.id}>
                                    {produto.nome} - {produto.id}
                                </option>
                            ))}
                        </select>
                    </div>

                    <input
                        type="number"
                        step="0.01"
                        placeholder="Valor da venda"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        required
                        className="w-full border border-[#BFB4AE] rounded-xl px-4 h-[50px] bg-[#f5efec] outline-none"
                    />

                    <input
                        type="number"
                        placeholder="Quantidade"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                        required
                        className="w-full border border-[#BFB4AE] rounded-xl px-4 h-[50px] bg-[#f5efec] outline-none"
                    />

                    <select
                        value={pagamento}
                        onChange={(e) => setPagamento(e.target.value)}
                        required
                        className="w-full border border-[#BFB4AE] rounded-xl px-4 h-[50px] bg-[#f5efec] outline-none"
                    >
                        <option value="debito">Débito</option>
                        <option value="credito">Crédito</option>
                        <option value="pix">Pix</option>
                        <option value="dinheiro">Dinheiro</option>
                    </select>

                    {pagamento === "credito" && (
                        <select
                            value={parcelas}
                            onChange={(e) => setParcelas(Number(e.target.value))}
                            className="w-full border border-[#BFB4AE] rounded-xl px-4 h-[50px] bg-[#f5efec] outline-none"
                        >
                            {[1, 2, 3, 4, 5].map((p) => (
                                <option key={p} value={p}>
                                    {p}x - {taxas.credito[p]}%
                                </option>
                            ))}
                        </select>
                    )}

                    <div className="text-right font-semibold text-[#8d402c]">
                        Valor líquido: R$ {valorLiquido.toFixed(2)}
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-300 text-[#61482a]"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-[#8d402c] text-white"
                        >
                            Salvar alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
