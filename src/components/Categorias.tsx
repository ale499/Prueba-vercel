import React from 'react';

interface CategoriasProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categorias = [
  'Todas',
  'Pizzas',
  'Empanadas',
  'Pastas',
  'Lomo',
  'Bebidas',
  'Tacos',
  'Guisos',
  'Postres',
  'Salsas'
];

export const Categorias = ({ selectedCategory, onSelectCategory }: CategoriasProps) => {
  return (
    <div className="w-48 sticky top-24">
      <h3 className="text-xl font-bold mb-4">Categorías</h3>
      <ul className="space-y-2">
        {categorias.map((cat) => (
          <li
            key={cat}
            className={`cursor-pointer px-3 py-2 rounded transition ${
              selectedCategory === cat ? 'bg-orange-500 text-white' : 'hover:bg-orange-100'
            }`}
            onClick={() => onSelectCategory(cat)}
          >
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
};
