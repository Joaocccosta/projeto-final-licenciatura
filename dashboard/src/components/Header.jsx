import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

const Header = () => {
  const { user, logout, isAuthenticated, isGuest } = useAuth(); // Add isGuest
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    // If logging in from guest mode, ensure guest mode is turned off by AuthContext's logout or login
    if (isGuest) {
        logout(); // This will set isGuest to false
    }
    navigate('/login');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login'); // After logout, always go to login page
  };

  return (
    <header className="bg-gray-300 h-40 p-4 flex items-center justify-between">
      <img src={logo} alt="Logo" className="h-30" />
      
      <div className="flex items-center">
        {isAuthenticated && user ? ( // Regular authenticated user
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
        ) : isGuest ? ( // Guest user
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">
              Modo Convidado
            </span>
            <button
              onClick={handleLoginRedirect} // Button to go to the login page
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              Login
            </button>
          </div>
        ) : ( // Not authenticated and not a guest (e.g., initial state before any action on login page, though this state might not be hit if on dashboard)
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