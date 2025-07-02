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

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function TabelaVendas() {
  const [vendas, setVendas] = useState([]);
  const [filtroBusca, setFiltroBusca] = useState("");
  const [filtroPagamento, setFiltroPagamento] = useState("todas");
  const [filtroPeriodo, setFiltroPeriodo] = useState("todas");
  const [vendaEditando, setVendaEditando] = useState(null);
  const [mostrarEditarModal, setMostrarEditarModal] = useState(false);
  const [vendaRemovendo, setVendaRemovendo] = useState(null);

  useEffect(() => {
    fetchVendas();
  }, []);

  async function fetchVendas() {
    try {
      const snap = await getDocs(query(collection(db, "vendas")));
      const lista = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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

  // Filtro de período
  function filtrarPorPeriodo(venda) {
    if (!venda.criadoEm?.seconds) return false;
    if (filtroPeriodo === "todas") return true;

    const agora = new Date();
    const dataVenda = new Date(venda.criadoEm.seconds * 1000);
    const diffDias = (agora - dataVenda) / (1000 * 60 * 60 * 24);

    switch (filtroPeriodo) {
      case "1d":
        return diffDias <= 1;
      case "1m":
        return diffDias <= 30;
      case "3m":
        return diffDias <= 90;
      default:
        return true;
    }
  }

  const vendasFiltradas = vendas
    .filter(filtrarPorPeriodo)
    .filter((v, index) => {
      const busca = filtroBusca.toLowerCase();
      return (
        v.produtoNome?.toLowerCase().includes(busca) ||
        (index + 1).toString().includes(busca)
      );
    })
    .filter((v) => {
      return filtroPagamento === "todas" || v.formaPagamento === filtroPagamento;
    });

  function exportarParaExcel() {
    // Mapear dados para formato plano
    const dadosParaExcel = vendasFiltradas.map((venda, index) => ({
      ID: index + 1,
      Produto: venda.produtoNome,
      Quantidade: venda.quantidade,
      Pagamento: venda.formaPagamento,
      Parcelas: venda.parcelas ?? "-",
      Valor: venda.valorVenda.toFixed(2),
      Líquido: venda.valorLiquido.toFixed(2),
      Data: formatarData(venda.criadoEm),
    }));

    // Criar worksheet e workbook
    const ws = XLSX.utils.json_to_sheet(dadosParaExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vendas");

    // Gerar arquivo excel em formato binário
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Salvar arquivo usando file-saver
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "vendas.xlsx");
  }

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
          value={filtroPagamento}
          onChange={(e) => setFiltroPagamento(e.target.value)}
          className="border border-[#BFB4AE] rounded-xl px-4 h-[50px] bg-[#f5efec] outline-none focus:border-[#8d402c] focus:border-2 w-full sm:w-[200px]"
        >
          <option value="todas">Todas as formas</option>
          <option value="debito">Débito</option>
          <option value="credito">Crédito</option>
          <option value="pix">Pix</option>
          <option value="dinheiro">Dinheiro</option>
        </select>

        <select
          value={filtroPeriodo}
          onChange={(e) => setFiltroPeriodo(e.target.value)}
          className="border border-[#BFB4AE] rounded-xl px-4 h-[50px] bg-[#f5efec] outline-none focus:border-[#8d402c] focus:border-2 w-full sm:w-[200px]"
        >
          <option value="todas">Todos os períodos</option>
          <option value="1d">Último dia</option>
          <option value="1m">Último mês</option>
          <option value="3m">Últimos 3 meses</option>
        </select>
      </div>

      <h3 className="text-[#61482a] font-bold mb-5 text-[20px]">Tabela de Vendas</h3>
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
              <th className="text-left px-4 py-3 min-w-[130px]">Líquido</th>
              <th className="text-left px-4 py-3 min-w-[160px]">Data</th>
              <th className="text-left px-4 py-3 min-w-[120px]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendasFiltradas.map((venda, index) => (
              <tr
                key={venda.id}
                className="border-b border-[#f0e7e3] hover:bg-[#f9f5f3] transition"
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{venda.produtoNome}</td>
                <td className="px-4 py-2">{venda.quantidade}</td>
                <td className="px-4 py-2 capitalize">{venda.formaPagamento}</td>
                <td className="px-4 py-2">{venda.parcelas ?? "-"}</td>
                <td className="px-4 py-2">R$ {venda.valorVenda.toFixed(2)}</td>
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

        {vendasFiltradas.length === 0 && (
          <div className="text-center text-[#8d402c] mt-4 font-medium">
            Nenhuma venda encontrada.
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={exportarParaExcel}
          className="bg-[#8d402c] text-white rounded-xl px-6 py-3 font-bold hover:bg-[#733420] transition"
        >
          Exportar Excel
        </button>
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
