"use client";

import { useState } from "react";
import CriarContaModal from "./modalUser";

export default function AdminPage() {
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <div className="px-8">
      <h3 className="text-[#61482a] font-bold my-5 text-[20px]">Contas</h3>
      <button
        onClick={() => setMostrarModal(true)}
        className="bg-[#8d402c] text-white rounded-xl px-6 py-3 font-bold hover:bg-[#733420] transition w-full"
      >
        Criar Nova Conta
      </button>

      {mostrarModal && (
        <CriarContaModal onClose={() => setMostrarModal(false)} />
      )}
    </div>
  );
}
