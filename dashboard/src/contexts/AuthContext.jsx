import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsGuest(false);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const result = await authService.login(username, password);
    if (result.success) {
      setUser(result.user);
      setIsGuest(false); // Ensure guest mode is off
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsGuest(false); // Turn off guest mode on logout
  };

  const loginAsGuest = () => {
    // Ensure any existing user session is cleared
    authService.logout(); // This clears localStorage for token and user
    setUser(null);
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider value={{ user, isGuest, loading, login, logout, loginAsGuest, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);