import Layout from "../components/layout/layout";
import ProtectedRoute from "../components/layout/protectedRoute";
import TabelaVendas from "../components/vendas/tabelaVendas";
import VendasModal from "../components/vendas/vendasCadastro";


export default function Produtos() {
    return (
        <ProtectedRoute>
            <div>
                <Layout />
                <div className="p-8">
                    <h1 className="text-[#61482a] font-bold mb-5 text-[20px]">Vendas</h1>
                    <VendasModal />
                    <TabelaVendas />
                </div>
            </div>
        </ProtectedRoute>
    );
}