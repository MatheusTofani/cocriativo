import InfosDashboard from "../components/dashboard/infos";
import UltimasAtualizacoes from "../components/dashboard/news";
import Layout from "../components/layout/layout";
import ProtectedRoute from "../components/layout/protectedRoute";

export default function Dashboard() {
    return (
        <ProtectedRoute>
            <div>
            <Layout />
            <div className="p-8">
                <h1 className="text-[#61482a] font-bold mb-5 text-[20px]"> Dashboard</h1>
                <InfosDashboard />
                <UltimasAtualizacoes />
            </div>
            </div>
       </ProtectedRoute>
    );
}