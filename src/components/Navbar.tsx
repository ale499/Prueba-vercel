import React, { useState } from 'react';
import { ShoppingCart, Search, User, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo-banner.webp'
import Icon from '../assets/Logo.webp'

interface NavbarProps {
  cartItemCount: number;
  onCartClick: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

const Navbar: React.FC<NavbarProps> = ({ cartItemCount, onCartClick, onSearchChange, searchQuery }) => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setUser({
      name: 'Usuario Demo',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    });
    setIsAuthModalOpen(false);
    setEmail('');
    setPassword('');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setIsProfileModalOpen(false);
  };

  const goToProfile = () => {
    setIsProfileModalOpen(false);
    navigate('/profile');
  };

  return (
    <header className="bg-primary text-idtxt shadow-lg sticky top-0 z-40">
      <div className="mx-auto px-4">
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer pr-4" onClick={() => navigate('/')}>
              <img src={Logo} alt="Logo" className='w-48' />
            </div>

            <div className="flex items-center">
              {isLoggedIn ? (
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="hover:bg-orange-700 rounded-full transition"
                >
                  <img
                    src={user?.avatar}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="p-2 hover:bg-orange-700 rounded-full transition"
                >
                  <User size={24} className='text-secondary' />
                </button>
              )}

              <button
                onClick={onCartClick}
                className="relative p-2 hover:bg-orange-700 rounded-full transition"
              >
                <ShoppingCart size={24} className='text-secondary' />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Buscar platillos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <Search className="absolute right-3 top-2.5 text-gray-500" size={20} />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between h-20 gap-4 p-0 lg:p-6">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            {/* Icono para pantallas de 1024px */}
            <img
              src={Icon}
              alt="Icon"
              className="w-full h-14 lg:hidden" // Visible en pantallas menores a 1024px
            />
            {/* Logo para pantallas mayores a 1024px */}
            <img
              src={Logo}
              alt="Logo"
              className="hidden lg:block w-40 h-auto sm:w-40 md:w-48 lg:w-64" // Visible en pantallas mayores a 1024px
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Buscar platillos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <Search className="absolute right-3 top-2.5 text-gray-500" size={20} />
            </div>

            {isLoggedIn ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="hover:bg-orange-700 rounded-full transition"
              >
                <img
                  src={user?.avatar}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setIsLoginMode(true);
                    setIsAuthModalOpen(true);
                  }}
                  className=" text-secondary hover:bg-orange-700 px-4 py-2 rounded-lg transition"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    setIsLoginMode(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-RegisterBtnHover transition"
                >
                  Registrarse
                </button>
              </div>
            )}

            <button
              onClick={onCartClick}
              className="text-secondary relative p-2 hover:bg-orange-700 rounded-full transition"
            >
              <ShoppingCart size={28} />
              {cartItemCount > 0 && (
                <span className=" absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}
              </h2>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-800"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-800"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-orange-700 transition"
              >
                {isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
              <button
                type="button"
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="w-full text-secondary hover:text-orange-700 transition"
              >
                {isLoginMode
                  ? '¿No tienes cuenta? Regístrate'
                  : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Mi Cuenta</h2>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <img
                src={user?.avatar}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-orange-600"
              />
              <div>
                <h3 className="font-semibold text-lg">{user?.name}</h3>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={goToProfile}
                className="w-full flex items-center justify-center space-x-2 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
              >
                <User size={20} />
                <span>Ver Perfil</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;