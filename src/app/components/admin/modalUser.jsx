"use client";
import { useState } from "react";
import { auth, db } from "../../data/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function CriarContaModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("vendedor");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleCriarConta(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "usuarios", uid), {
        email,
        role,
      });

      onClose();
    } catch (err) {
      console.error("Erro ao criar conta:", err);
      setErro("Erro ao criar conta. Verifique os dados.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050]" onClick={onClose}>
      <div
        className="bg-white p-6 rounded-xl max-w-md w-[95%] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl text-[#8d402c] font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-[#8d402c] mb-4">Criar Nova Conta</h2>
        <form className="space-y-4" onSubmit={handleCriarConta}>
          <div>
            <label className="block text-[#61482a] font-medium mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#BFB4AE] rounded-xl px-4 h-[50px] bg-[#f5efec] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[#61482a] font-medium mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border border-[#BFB4AE] rounded-xl px-4 h-[50px] bg-[#f5efec] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[#61482a] font-medium mb-1">Permissão</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-[#BFB4AE] rounded-xl px-4 h-[50px] bg-[#f5efec] outline-none"
            >
              <option value="admin">Admin</option>
              <option value="vendedor">Vendedor</option>
              <option value="estoque">Estoque</option>
            </select>
          </div>

          {erro && <p className="text-red-600 text-sm">{erro}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={carregando}
              className="bg-[#8d402c] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#733420] transition"
            >
              {carregando ? "Criando..." : "Criar Conta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
