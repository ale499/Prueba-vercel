import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Store, CreditCard, Wallet, Clock, MapPin, Phone, Mail, User } from 'lucide-react';
import type { Product } from '../store/cartStore';
import { useCartStore } from '../store/cartStore';

export interface CheckoutProps {
  cart: Product[];
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryMethod: 'delivery' | 'pickup';
  paymentMethod: 'mercadopago' | 'cash';
  notes: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const Checkout: React.FC<CheckoutProps> = ({ cart,  }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    deliveryMethod: 'delivery',
    paymentMethod: 'mercadopago',
    notes: ''
  });

  // Simulate getting user data from context/state
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userProfile: UserProfile | null = isLoggedIn ? {
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    phone: localStorage.getItem('userPhone') || '',
    address: localStorage.getItem('userAddress') || ''
  } : null;

  useEffect(() => {
    if (isLoggedIn && userProfile) {
      setFormData(prev => ({
        ...prev,
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        address: userProfile.address
      }));
    }
  }, [isLoggedIn, userProfile]);

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = formData.deliveryMethod === 'delivery' ? 5 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Create order summary for confirmation
    const orderDetails = {
      items: cart,
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      },
      delivery: formData.deliveryMethod,
      payment: formData.paymentMethod,
      notes: formData.notes,
      total: total,
      orderDate: new Date().toISOString()
    };

    console.log('Order Details:', orderDetails);
    alert('¡Pedido realizado con éxito!');
    navigate('/');
  };

  async function confirmarPedidoMercadoPago(cart: Product[]) {
    const detalles = cart.map(item => ({
      cantidad: item.quantity,
      articulo: {
        id: item.id,
        type: "MANUFACTURADO"
      }
    }));

    const body = {
      detalles,
      tipoEnvio: "TAKEAWAY"
    };

    const response = await fetch('http://localhost:8080/api/pagos/prueba-pago', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_API_BEARER}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      alert('Error al procesar el pago');
      return;
    }

    const data = await response.json();
    if (data.initPoint) {
      window.location.href = data.initPoint;
    } else {
      alert('No se recibió el link de pago');
    }
  }

  const handleConfirm = () => {
    if (formData.paymentMethod === 'mercadopago') {
      confirmarPedidoMercadoPago(cart);
    } else {
      handleSubmit();
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <button
          onClick={() => navigate('/menu')}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          Ver Menú
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Finalizar Pedido</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de Checkout */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Datos Personales */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Datos Personales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 text-gray-400" size={20} />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                        placeholder="Juan Pérez"
                        readOnly={isLoggedIn}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 text-gray-400" size={20} />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                        placeholder="juan@ejemplo.com"
                        readOnly={isLoggedIn}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 text-gray-400" size={20} />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                        placeholder="+54 11 1234-5678"
                        readOnly={isLoggedIn}
                      />
                    </div>
                  </div>
                  {formData.deliveryMethod === 'delivery' && (
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección de Entrega
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                          placeholder="Av. Corrientes 1234"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Método de Entrega */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Método de Entrega</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'delivery' })}
                    className={`p-4 rounded-lg border-2 flex items-center space-x-3 transition
                      ${formData.deliveryMethod === 'delivery'
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-600'}`}
                  >
                    <Truck size={24} className={formData.deliveryMethod === 'delivery' ? 'text-orange-600' : 'text-gray-500'} />
                    <div className="text-left">
                      <p className="font-semibold">Envío a Domicilio</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={16} className="mr-1" />
                        <span>30-45 minutos</span>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'pickup' })}
                    className={`p-4 rounded-lg border-2 flex items-center space-x-3 transition
                      ${formData.deliveryMethod === 'pickup'
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-600'}`}
                  >
                    <Store size={24} className={formData.deliveryMethod === 'pickup' ? 'text-orange-600' : 'text-gray-500'} />
                    <div className="text-left">
                      <p className="font-semibold">Retiro en Local</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={16} className="mr-1" />
                        <span>15-20 minutos</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Método de Pago */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'mercadopago' })}
                    className={`p-4 rounded-lg border-2 flex items-center space-x-3 transition
                      ${formData.paymentMethod === 'mercadopago'
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-600'}`}
                  >
                    <CreditCard size={24} className={formData.paymentMethod === 'mercadopago' ? 'text-orange-600' : 'text-gray-500'} />
                    <div className="text-left">
                      <p className="font-semibold">Mercado Pago</p>
                      <p className="text-sm text-gray-500">Tarjeta o transferencia</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                    className={`p-4 rounded-lg border-2 flex items-center space-x-3 transition
                      ${formData.paymentMethod === 'cash'
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-600'}`}
                  >
                    <Wallet size={24} className={formData.paymentMethod === 'cash' ? 'text-orange-600' : 'text-gray-500'} />
                    <div className="text-left">
                      <p className="font-semibold">Efectivo</p>
                      <p className="text-sm text-gray-500">Pago al recibir</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Notas adicionales */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Notas Adicionales</h2>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Instrucciones especiales para tu pedido..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 h-24"
                />
              </div>
            </form>
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
              
              {/* Items del pedido */}
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-start py-2 border-b">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Detalles del costo */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {formData.deliveryMethod === 'delivery' && (
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Tiempo estimado */}
              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <div className="flex items-center text-orange-600">
                  <Clock size={20} className="mr-2" />
                  <span className="font-medium">Tiempo estimado:</span>
                </div>
                <p className="text-gray-600 mt-1">
                  {formData.deliveryMethod === 'delivery' ? '30-45 minutos' : '15-20 minutos'}
                </p>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center justify-center space-x-2"
              >
                <span>
                  {formData.paymentMethod === 'mercadopago' ? 'Confirmar con Mercado Pago' : 'Confirmar Pedido'}
                </span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;