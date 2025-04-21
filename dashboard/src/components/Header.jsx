import logo from '../assets/logo.png';

const Header = () => (
    <header className="bg-gray-300 p-4 flex items-center justify-between">
      <img src={logo} alt="Logo" className="h-30" />
    </header>
  );
  
  export default Header;