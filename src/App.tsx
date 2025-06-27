import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Home from './components/Home';
import Menu from './components/Menu';
import Footer from './components/Footer';
import { useCartStore } from './store/cartStore';
import Checkout from './components/Checkout';


function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Obtén los items y funciones del store
  const cart = useCartStore(state => state.items);
  const setCart = useCartStore.setState; // Para manipular el estado si lo necesitas (avanzado)
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const clearCart = useCartStore(state => state.clearCart);

  // Obtén el contador de productos del carrito global
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar 
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/checkout"
            element={
              <Checkout
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
              />
            }
          />
        </Routes>

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </div>

      <Footer />
    </div>
  );
}

export default App;