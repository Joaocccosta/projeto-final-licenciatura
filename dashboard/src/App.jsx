import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import NotFoundPage from './pages/NotFoundPage'; // Importa a página de não encontrado
import Dashboard from './pages/Dashboard'; // Importa o Dashboard

// Componente para proteger rotas privadas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isGuest, loading } = useAuth(); // Inclui isGuest

  if (loading) {
    return <div>Carregando...</div>;
  }

  // Permite acesso se autenticado OU se for sessão de convidado
  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard" // Rota dedicada para o Dashboard
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/" // Redireciona a raiz para /dashboard
            element={<Navigate to="/dashboard" replace />}
          />
          {/* Rota catch-all para caminhos não encontrados, mostra NotFoundPage */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
