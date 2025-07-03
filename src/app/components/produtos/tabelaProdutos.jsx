"use client";
import { useEffect, useState } from "react";
import { db } from "../../data/firebase";
import { collection, getDocs, query, deleteDoc, doc } from "firebase/firestore";
import EditarProdutoModal from "./editModal";
import ModalConfirmacao from "./removeModal";

export default function TabelaProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [filtroBusca, setFiltroBusca] = useState("");
    const [filtroMarca, setFiltroMarca] = useState("todas");
    const [ordem, setOrdem] = useState("recentes");

    const marcasDisponiveis = [
        "Open House",
        "Visionaire",
        "Jaqueline Braga",
        "Art Tábuas",
        "DP Semijoias",
        "Datiza Velas Aromáticas",
        "Francine Moreira",
    ];

    const [produtoEditando, setProdutoEditando] = useState(null);
    const [mostrarEditarModal, setMostrarEditarModal] = useState(false);

    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
    const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);

    function handleEdit(produto) {
        setProdutoEditando(produto);
        setMostrarEditarModal(true);
    }

    function handleDelete(produto) {
        setProdutoParaExcluir(produto);
        setMostrarConfirmacao(true);
    }

    async function confirmarExclusao() {
        if (!produtoParaExcluir) return;

        try {
            await deleteDoc(doc(db, "produtos", produtoParaExcluir.idFirebase));
            setProdutos(produtos.filter((p) => p.idFirebase !== produtoParaExcluir.idFirebase));
            setProdutoParaExcluir(null);
            setMostrarConfirmacao(false);
        } catch (error) {
            console.error("Erro ao deletar produto:", error);
        }
    }

    useEffect(() => {
        fetchProdutos();
    }, [ordem]);

    async function fetchProdutos() {
        try {
            const querySnapshot = await getDocs(query(collection(db, "produtos")));
            const lista = querySnapshot.docs.map((doc) => ({
                idFirebase: doc.id,
                ...doc.data(),
            }));

            const ordenado = lista
                .filter(p => p.criadoEm?.seconds)
                .sort((a, b) => {
                    const t1 = a.criadoEm.seconds;
                    const t2 = b.criadoEm.seconds;
                    return ordem === "recentes" ? t2 - t1 : t1 - t2;
                });

            setProdutos(ordenado);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    }

    const produtosFiltrados = produtos
        .filter((produto, index) => {
            const busca = filtroBusca.toLowerCase();
            return (
                produto.nome.toLowerCase().includes(busca) ||
                (index + 1).toString().includes(busca)
            );
        })
        .filter((produto) => {
            return filtroMarca === "todas" || produto.marca === filtroMarca;
        });

    return (
        <div className="mt-8 space-y-6">
            <h2 className="text-[#61482a] font-bold mb-5 text-[20px]">Filtros</h2>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <input
                    type="text"
                    placeholder="Buscar por nome ou ID"
                    value={filtroBusca}
                    onChange={(e) => setFiltroBusca(e.target.value)}
                    className="border border-[#BFB4AE] rounded-xl px-4 h-[50px] bg-[#f5efec] outline-none focus:border-[#8d402c] focus:border-2 w-full sm:w-[300px]"
                />

                <select
                    value={filtroMarca}
                    onChange={(e) => setFiltroMarca(e.target.value)}
                    className="border border-[#BFB4AE] rounded-xl px-4 h-[50px] bg-[#f5efec] outline-none focus:border-[#8d402c] focus:border-2 w-full sm:w-[200px]"
                >
                    <option value="todas">Todas as marcas</option>
                    {marcasDisponiveis.map((marca) => (
                        <option key={marca} value={marca}>
                            {marca}
                        </option>
                    ))}
                </select>

                <select
                    value={ordem}
                    onChange={(e) => setOrdem(e.target.value)}
                    className="border border-[#BFB4AE] rounded-xl px-4 h-[50px] bg-[#f5efec] outline-none focus:border-[#8d402c] focus:border-2 w-full sm:w-[200px]"
                >
                    <option value="recentes">Mais recentes</option>
                    <option value="antigos">Mais antigos</option>
                </select>
            </div>

            {/* Tabela */}

            <h3 className="text-[#61482a] font-bold mb-5 text-[20px]">Tabela de Produtos</h3>
            <div className="overflow-auto">
                <table className="min-w-full bg-white border border-[#BFB4AE] rounded-xl text-[#61482a]">
                    <thead className="bg-[#f5efec] border-b border-[#BFB4AE] text-left">
                        <tr>
                            <th className="px-4 py-3 w-[60px]">ID</th>
                            <th className="px-4 py-3 w-[200px]">Produto</th>
                            <th className="px-4 py-3 w-[120px]">Preço</th>
                            <th className="px-4 py-3 w-[180px]">Marca</th>
                            <th className="px-4 py-3 w-[100px]">Estoque</th>
                            <th className="px-4 py-3 w-[250px]">Observação</th>
                            <th className="px-4 py-3 w-[140px]">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtosFiltrados.map((produto, index) => (
                            <tr key={produto.idFirebase} className="border-b border-[#f0e7e3] hover:bg-[#f9f5f3] transition">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{produto.nome}</td>
                                <td className="px-4 py-2">R$ {produto.preco?.toFixed(2)}</td>
                                <td className="px-4 py-2">{produto.marca}</td>
                                <td className="px-4 py-2">{produto.estoque ?? "-"}</td>
                                <td className="px-4 py-2">{produto.observacao ?? "-"}</td>
                                <td className="px-4 py-2 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(produto)}
                                        className="px-3 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(produto)}
                                        className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                                    >
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {produtosFiltrados.length === 0 && (
                    <div className="text-center text-[#8d402c] mt-4 font-medium">
                        Nenhum produto encontrado.
                    </div>
                )}
            </div>

            {/* Modal de Edição */}
            {mostrarEditarModal && produtoEditando && (
                <EditarProdutoModal
                    produto={produtoEditando}
                    onClose={() => setMostrarEditarModal(false)}
                    onAtualizar={fetchProdutos}
                />
            )}

            {/* Modal de Confirmação */}
            {mostrarConfirmacao && produtoParaExcluir && (
                <ModalConfirmacao
                    texto={`Tem certeza que deseja excluir o produto "${produtoParaExcluir.nome}"?`}
                    onConfirmar={confirmarExclusao}
                    onCancelar={() => {
                        setMostrarConfirmacao(false);
                        setProdutoParaExcluir(null);
                    }}
                />
            )}
        </div>
    );
}
