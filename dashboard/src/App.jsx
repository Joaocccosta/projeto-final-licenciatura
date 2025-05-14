import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import NotFoundPage from './pages/NotFoundPage'; // Import the NotFoundPage
import Dashboard from './pages/Dashboard'; // Import Dashboard from its new location

// Componente de proteção de rota
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isGuest, loading } = useAuth(); // Add isGuest

  if (loading) {
    return <div>Carregando...</div>;
  }

  // Allow access if authenticated OR if it's a guest session
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
            path="/dashboard" // Dedicated route for the Dashboard
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/" // Root path now redirects to /dashboard
            element={<Navigate to="/dashboard" replace />}
          />
          {/* Catch-all route for any paths not matched above, now shows NotFoundPage */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
