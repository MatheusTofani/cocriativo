"use client";
import { useEffect, useState } from "react";
import { db } from "../../data/firebase";
import { collection, getDocs, query } from "firebase/firestore";

export default function InfosDashboard() {
  const [totalVendas, setTotalVendas] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);

  useEffect(() => {
    async function fetchDados() {
      try {
        const agora = new Date();
        const timestampLimite = new Date(agora.getTime() - 24 * 60 * 60 * 1000); // 24h atrás

        const snap = await getDocs(query(collection(db, "vendas")));
        const vendasUltimas24h = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((venda) => {
            if (!venda.criadoEm?.seconds) return false;
            const dataVenda = new Date(venda.criadoEm.seconds * 1000);
            return dataVenda >= timestampLimite && dataVenda <= agora;
          });

        const somaValor = vendasUltimas24h.reduce(
          (acc, venda) => acc + (venda.valorVenda ?? 0),
          0
        );

        setTotalVendas(vendasUltimas24h.length);
        setValorTotal(somaValor);
      } catch (error) {
        console.error("Erro ao buscar vendas para dashboard:", error);
      }
    }

    fetchDados();
  }, []);

  return (
    <div className="w-full flex justify-between">
      <div className="w-[150px] h-[150px] bg-[#f5efec] border-2 border-[#BFB4AE] rounded-lg flex flex-col justify-center gap-2 items-center text-[#61482a] p-3 ">
        <div className="text-center text-[14px]">
          <p>Últimas</p>
          <span className="font-bold">24 horas</span>
        </div>

        <div className="text-center">
          <span className="text-[40px] font-bold leading-none">
        {valorTotal.toFixed(0)}
          </span>
          <p className="text-[14px]">Reais</p>
        </div>
      </div>

      <div className="w-[150px] h-[150px] bg-[#f5efec] border-2 border-[#BFB4AE] rounded-lg flex flex-col justify-center gap-2 items-center text-[#61482a] p-3 ">
        <div className="text-center text-[14px]">
          <p>Últimas</p>
          <span className="font-bold">24 horas</span>
        </div>

        <div className="text-center">
          <span className="text-[40px] font-bold leading-none">{totalVendas}</span>
          <p className="text-[14px]">Vendas</p>
        </div>
      </div>
    </div>
  );
}
