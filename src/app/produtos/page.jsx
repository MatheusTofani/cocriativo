import Layout from "../components/layout/layout";
import ProtectedRoute from "../components/layout/protectedRoute";
import ProdutosModal from "../components/produtos";
import TabelaProdutos from "../components/produtos/tabelaProdutos";

export default function Produtos() {
    return (
        <ProtectedRoute>
            <div>
                <Layout />
                <div className="p-8">
                    <h1 className="text-[#61482a] font-bold mb-5 text-[20px]">Produtos</h1>
                    <ProdutosModal />
                    <TabelaProdutos />
                </div>
            </div>
        </ProtectedRoute>
    );
}