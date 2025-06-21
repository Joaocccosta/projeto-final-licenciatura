import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se existe utilizador autenticado ao montar o contexto
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsGuest(false);
    }
    setLoading(false);
  }, []);

  // Função para login normal
  const login = async (username, password) => {
    const result = await authService.login(username, password);
    if (result.success) {
      setUser(result.user);
      setIsGuest(false); // Garantir que o modo convidado está desligado
    }
    return result;
  };

  // Função para logout
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsGuest(false); // Desligar modo convidado no logout
  };

  // Função para login como convidado
  const loginAsGuest = () => {
    // Garantir que qualquer sessão existente é limpa
    authService.logout(); // Limpa localStorage para token e utilizador
    setUser(null);
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider value={{ user, isGuest, loading, login, logout, loginAsGuest, isAuthenticated: !!user }}>
      {/* Só renderiza os filhos quando o loading terminar */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);