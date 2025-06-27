import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo y Descripción */}
        <div>
          <img 
            src="/src/assets/Logo-banner.webp" 
            alt="El Buen Sabor logo" 
            className="h-16 mx-auto md:mx-0 mb-4"
          />
          <p className="text-gray-400">
            Donde cada plato cuenta una historia de sabor y tradición latina.
          </p>
        </div>

        {/* Enlaces rápidos */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/" className="hover:text-white">Inicio</a></li>
            <li><a href="/menu" className="hover:text-white">Menú</a></li>
            <li><a href="/contacto" className="hover:text-white">Contacto</a></li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contáctanos</h4>
          <p className="text-gray-400">Tel: (123) 456-7890</p>
          <p className="text-gray-400">Email: contacto@elbuen sabor.com</p>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-8 text-sm">
        © {new Date().getFullYear()} El Buen Sabor. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
