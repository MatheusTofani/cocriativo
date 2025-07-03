import Layout from "../components/layout/layout";
import ProtectedRoute from "../components/layout/protectedRoute";
import TabelaVendas from "../components/admin/tabelaVendas";
import AdminPage from "../components/admin/user";
import TabelaContas from "../components/admin/tabelaContas";



export default function Admin() {
    return (
        <div>
        <ProtectedRoute>
            <div>
                <Layout />
                <div className="py-8">
                    <h1 className="text-[#61482a] font-bold mb-5 text-[20px] px-8">Vendas Gerais</h1>
                    <TabelaVendas />
                    <AdminPage />
                    <TabelaContas />
                </div>
            </div>
        </ProtectedRoute>
        </div>
    );
}