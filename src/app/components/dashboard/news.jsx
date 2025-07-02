"use client";
import { useEffect, useState } from "react";
import { db } from "../../data/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function UltimasAtualizacoes() {
    const [atualizacoes, setAtualizacoes] = useState([]);

    useEffect(() => {
        async function fetchAtualizacoes() {
            try {
                // Buscar últimas 5 vendas
                const vendasSnap = await getDocs(
                    query(collection(db, "vendas"), orderBy("criadoEm", "desc"), limit(5))
                );
                const vendas = vendasSnap.docs.map(doc => ({
                    id: doc.id,
                    tipo: "venda",
                    data: doc.data().criadoEm,
                    produtoNome: doc.data().produtoNome || "Produto não definido",
                }));

                // Buscar últimos 5 produtos
                const produtosSnap = await getDocs(
                    query(collection(db, "produtos"), orderBy("criadoEm", "desc"), limit(5))
                );
                const produtos = produtosSnap.docs.map(doc => ({
                    id: doc.id,
                    tipo: "produto",
                    data: doc.data().criadoEm,
                    nome: doc.data().nome || "Produto sem nome",
                }));

                // Unir e ordenar tudo por data desc
                const combinados = [...vendas, ...produtos].sort((a, b) => {
                    const tA = a.data?.seconds ?? 0;
                    const tB = b.data?.seconds ?? 0;
                    return tB - tA;
                });

                setAtualizacoes(combinados);
            } catch (error) {
                console.error("Erro ao buscar últimas atualizações:", error);
            }
        }

        fetchAtualizacoes();
    }, []);

    function formatarData(timestamp) {
        if (!timestamp?.seconds) return "";
        const data = new Date(timestamp.seconds * 1000);
        return data.toLocaleDateString("pt-BR") + " às " + data.toLocaleTimeString("pt-BR");
    }

    return (
        <div className="p-4 bg-[#f5efec] border border-[#BFB4AE] rounded-xl text-[#61482a] max-w-md mt-[40px]">
            <h2 className="text-xl font-bold mb-4">Últimas Atualizações</h2>
            <ul className="list-disc list-inside space-y-2 max-h-60 overflow-y-auto">
                {atualizacoes.length === 0 && <li>Nenhuma atualização recente.</li>}
                {atualizacoes.map((item) => (
                    <li key={item.id} className="text-sm">
                        {item.tipo === "venda" ? (
                            <>
                                Nova venda do produto <strong>{item.produtoNome}</strong> em {formatarData(item.data)}
                            </>
                        ) : (
                            <>
                                Novo produto <strong>"{item.nome}"</strong> cadastrado em {formatarData(item.data)}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
