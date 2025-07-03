"use client";
import { useEffect, useState } from "react";
import { db } from "../../data/firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export default function TabelaContas() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [usuarioRemovendo, setUsuarioRemovendo] = useState(null);
  const [emailEditado, setEmailEditado] = useState("");
  const [roleEditado, setRoleEditado] = useState("vendedor");
  const [senhaEditada, setSenhaEditada] = useState("");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  async function fetchUsuarios() {
    const snap = await getDocs(collection(db, "usuarios"));
    const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setUsuarios(lista);
  }

  function abrirEditar(usuario) {
    setUsuarioEditando(usuario);
    setEmailEditado(usuario.email);
    setRoleEditado(usuario.role);
    setSenhaEditada(""); // limpa ao abrir
  }

  async function salvarEdicao(e) {
    e.preventDefault();
    try {
      const novosDados = {
        email: emailEditado,
        role: roleEditado,
        ...(senhaEditada && { senha: senhaEditada }),
      };

      await updateDoc(doc(db, "usuarios", usuarioEditando.id), novosDados);
      setUsuarioEditando(null);
      fetchUsuarios();
    } catch (err) {
      console.error("Erro ao editar usuário:", err);
    }
  }

  async function confirmarRemocao() {
    try {
      await deleteDoc(doc(db, "usuarios", usuarioRemovendo.id));
      setUsuarioRemovendo(null);
      fetchUsuarios();
    } catch (err) {
      console.error("Erro ao remover usuário:", err);
    }
  }

  return (
    <div className="px-8 py-6">
      <h2 className="text-[#61482a] font-bold text-[20px] mb-4">Contas Criadas</h2>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border border-[#BFB4AE] rounded-xl text-[#61482a]">
          <thead className="bg-[#f5efec]">
            <tr>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Permissão</th>
              <th className="text-left px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr
                key={u.id}
                className="border-b border-[#eee] hover:bg-[#f9f5f3] transition"
              >
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 capitalize">{u.role}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => abrirEditar(u)}
                    className="px-3 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setUsuarioRemovendo(u)}
                    className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Editar */}
      {usuarioEditando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050]"
          onClick={() => setUsuarioEditando(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-xl max-w-md w-[95%] relative"
          >
            <button
              onClick={() => setUsuarioEditando(null)}
              className="absolute top-2 right-3 text-2xl text-[#8d402c] font-bold"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-[#8d402c] mb-4">Editar Conta</h2>
            <form className="space-y-4" onSubmit={salvarEdicao}>
              <input
                type="email"
                value={emailEditado}
                onChange={(e) => setEmailEditado(e.target.value)}
                className="w-full border border-[#BFB4AE] rounded-xl px-4 h-[50px] bg-[#f5efec] outline-none"
                required
              />
              <select
                value={roleEditado}
                onChange={(e) => setRoleEditado(e.target.value)}
                className="w-full border border-[#BFB4AE] rounded-xl px-4 h-[50px] bg-[#f5efec] outline-none"
              >
                <option value="admin">Admin</option>
                <option value="vendedor">Vendedor</option>
                <option value="estoque">Estoque</option>
              </select>
              <input
                type="password"
                placeholder="Nova senha (opcional)"
                value={senhaEditada}
                onChange={(e) => setSenhaEditada(e.target.value)}
                className="w-full border border-[#BFB4AE] rounded-xl px-4 h-[50px] bg-[#f5efec] outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#8d402c] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#733420] transition"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Remover */}
      {usuarioRemovendo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050]"
          onClick={() => setUsuarioRemovendo(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-xl max-w-sm w-[90%] relative"
          >
            <button
              onClick={() => setUsuarioRemovendo(null)}
              className="absolute top-2 right-3 text-2xl text-[#8d402c] font-bold"
            >
              ×
            </button>
            <h3 className="text-[#8d402c] text-lg font-bold mb-4">Remover Conta</h3>
            <p className="mb-6">Tem certeza que deseja remover esta conta?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setUsuarioRemovendo(null)}
                className="px-4 py-2 rounded bg-gray-300 text-[#61482a]"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarRemocao}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
