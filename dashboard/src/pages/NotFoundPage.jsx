import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Página Não Encontrada</h2>
      <p className="mb-6 text-center">
        Lamentamos, mas a página que você está à procura não existe <br />
        ou foi movida.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Voltar ao Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;