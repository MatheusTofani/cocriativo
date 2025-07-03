"use client";
import { useEffect, useState } from "react";
import { db } from "../../data/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
} from "firebase/firestore";
import EditarVendaModal from "./editModal";
import RemoverVendaModal from "./removerVenda";

export default function TabelaVendasDoDia() {
  const [vendas, setVendas] = useState([]);
  const [vendaEditando, setVendaEditando] = useState(null);
  const [mostrarEditarModal, setMostrarEditarModal] = useState(false);
  const [vendaRemovendo, setVendaRemovendo] = useState(null);

  useEffect(() => {
    fetchVendas();
  }, []);

  async function fetchVendas() {
    try {
      const snap = await getDocs(query(collection(db, "vendas")));
      const hoje = new Date();
      const dia = hoje.getDate();
      const mes = hoje.getMonth();
      const ano = hoje.getFullYear();

      const lista = snap.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((venda) => {
          const dataVenda = venda.criadoEm?.seconds
            ? new Date(venda.criadoEm.seconds * 1000)
            : null;

          return (
            dataVenda &&
            dataVenda.getDate() === dia &&
            dataVenda.getMonth() === mes &&
            dataVenda.getFullYear() === ano
          );
        });

      setVendas(lista);
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
    }
  }

  function formatarData(timestamp) {
    const date = new Date(timestamp.seconds * 1000);
    return (
      date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR")
    );
  }

  function handleEdit(venda) {
    setVendaEditando(venda);
    setMostrarEditarModal(true);
  }

  function handleDelete(venda) {
    setVendaRemovendo(venda);
  }

  async function confirmarRemocao() {
    try {
      await deleteDoc(doc(db, "vendas", vendaRemovendo.id));
      setVendas(vendas.filter((v) => v.id !== vendaRemovendo.id));
      setVendaRemovendo(null);
    } catch (error) {
      console.error("Erro ao deletar venda:", error);
    }
  }

  return (
    <div className="mt-8  space-y-6">
      <h3 className="text-[#61482a] font-bold mb-5 text-[20px]">
       Tabela de Vendas
      </h3>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border border-[#BFB4AE] rounded-xl text-[#61482a]">
          <thead className="bg-[#f5efec] border-b border-[#BFB4AE]">
            <tr>
              <th className="text-left px-4 py-3 min-w-[80px]">ID</th>
              <th className="text-left px-4 py-3 min-w-[160px]">Produto</th>
              <th className="text-left px-4 py-3 min-w-[100px]">Qtd</th>
              <th className="text-left px-4 py-3 min-w-[130px]">Pagamento</th>
              <th className="text-left px-4 py-3 min-w-[80px]">Parcelas</th>
              <th className="text-left px-4 py-3 min-w-[130px]">Valor</th>
              <th className="text-left px-4 py-3 min-w-[160px]">Data</th>
              <th className="text-left px-4 py-3 min-w-[120px]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((venda, index) => (
              <tr
                key={venda.id}
                className="border-b border-[#f0e7e3] hover:bg-[#f9f5f3] transition"
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{venda.produtoNome}</td>
                <td className="px-4 py-2">{venda.quantidade}</td>
                <td className="px-4 py-2 capitalize">{venda.formaPagamento}</td>
                <td className="px-4 py-2">{venda.parcelas ?? "-"}</td>
                <td className="px-4 py-2">R$ {venda.valorLiquido.toFixed(2)}</td>
                <td className="px-4 py-2">{formatarData(venda.criadoEm)}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(venda)}
                    className="px-3 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(venda)}
                    className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {vendas.length === 0 && (
          <div className="text-center text-[#8d402c] mt-4 font-medium">
            Nenhuma venda registrada hoje.
          </div>
        )}
      </div>

      {mostrarEditarModal && vendaEditando && (
        <EditarVendaModal
          venda={vendaEditando}
          onClose={() => setMostrarEditarModal(false)}
          onAtualizar={fetchVendas}
        />
      )}

      {vendaRemovendo && (
        <RemoverVendaModal
          onConfirmar={confirmarRemocao}
          onCancelar={() => setVendaRemovendo(null)}
        />
      )}
    </div>
  );
}
