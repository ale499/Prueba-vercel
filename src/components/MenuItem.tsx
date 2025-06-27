import React from 'react';
import { Plus } from 'lucide-react';

interface MenuItemProps {
  item: {
    name: string;
    price: number;
    image: string;
    description: string;
  };
  onAddToCart: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
        <p className="text-gray-600 mb-3">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-orange-600">${item.price}</span>
          <button
            onClick={onAddToCart}
            className="bg-secondary text-white p-2 rounded-full hover:bg-orange-700 transition"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;