"use client";

export default function ModalConfirmacao({ texto, onConfirmar, onCancelar }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050]"
            onClick={onCancelar}
        >
            <div
                className="bg-white p-6 rounded-xl shadow-xl max-w-[400px] w-[90%] text-[#61482a]"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold mb-4">Confirmar ação</h2>
                <p className="mb-6">{texto}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancelar}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-[#61482a]"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirmar}
                        className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
