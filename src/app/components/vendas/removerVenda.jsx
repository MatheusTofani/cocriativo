"use client";
export default function RemoverVendaModal({ onConfirmar, onCancelar }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050]"
            onClick={onCancelar}
        >
            <div
                className="bg-white p-6 rounded-xl w-[90%] max-w-[400px]"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-[#8d402c] mb-4">Remover Venda</h2>
                <p className="text-[#61482a] mb-6">Tem certeza que deseja remover esta venda?</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancelar}
                        className="px-4 py-2 bg-gray-300 text-[#61482a] rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirmar}
                        className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                        Remover
                    </button>
                </div>
            </div>
        </div>
    );
}
