import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

const Header = () => {
  const { user, logout, isAuthenticated, isGuest } = useAuth(); // Adiciona isGuest
  const navigate = useNavigate();

  // Redirecionar para login
  const handleLoginRedirect = () => {
    // Se estiver em modo convidado, garantir que o modo convidado é desligado pelo logout do AuthContext
    if (isGuest) {
        logout(); // Isto vai definir isGuest como falso
    }
    navigate('/login');
  };

  // Fazer logout e redirecionar para login
  const handleLogout = async () => {
    await logout();
    navigate('/login'); // Após logout, vai sempre para a página de login
  };

  return (
    <header className="bg-gray-300 h-40 p-4 flex items-center justify-between">
      <img src={logo} alt="Logo" className="h-30" />
      
      <div className="flex items-center">
        {isAuthenticated && user ? ( // Utilizador autenticado
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">
              Olá, {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        ) : isGuest ? ( // Utilizador convidado
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">
              Modo Convidado
            </span>
            <button
              onClick={handleLoginRedirect} // Botão para ir para a página de login
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              Login
            </button>
          </div>
        ) : ( // Não autenticado e não convidado (ex: estado inicial antes de qualquer ação na página de login)
          <button
            onClick={handleLoginRedirect}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;