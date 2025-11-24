import React from "react";

const NoEncontrada = () => {
    return (
        <div className="text-center py-8 space-y-3">
            <h2 className="text-xl font-bold text-gray-900">
                Pagina no encontrada
            </h2>
            <a
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm-font-medium py-2 px-4 rounded transition-color"
            >
                Volver al inicio
            </a>
        </div>
    );
};

export default NoEncontrada;
