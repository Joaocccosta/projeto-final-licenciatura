import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // For regular login
  const [guestLoading, setGuestLoading] = useState(false); // For guest login
  
  const { login, loginAsGuest } = useAuth(); // Add loginAsGuest
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Usuário e senha são obrigatórios');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      const result = await login(username, password);
      
      if (result.success) {
        navigate('/dashboard'); // Navigate to dashboard on successful login
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      let errorMessage = 'Erro ao conectar ao servidor';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setGuestLoading(true);
    setError(''); // Clear any previous errors
    loginAsGuest();
    navigate('/dashboard'); // Navigate to dashboard after setting guest mode
    // No need for finally block if loginAsGuest is synchronous and doesn't throw
    // setGuestLoading(false); // Can be removed if navigation happens immediately
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">
          Login do Dashboard de Produção
        </h2>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              required
              disabled={guestLoading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              required
              disabled={guestLoading}
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading || guestLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGuestLogin} // Implement this function
            disabled={loading || guestLoading} // Disable if any login is in progress
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 disabled:opacity-50"
          >
            {guestLoading ? 'Entrando como convidado...' : 'Entrar como convidado'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;