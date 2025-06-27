import MenuItem from './MenuItem';
import { useCartStore } from '../store/cartStore'; // Importa el store
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Loader2, MenuIcon, X } from 'lucide-react';
import { apiService, Categoria, Producto, Subcategoria } from '../services/api';

const Menu = () => {
  const addToCart = useCartStore(state => state.addToCart); // Obtiene la función
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs para el dropdown móvil
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productosData, categoriasData, subcategoriasData] = await Promise.all([
          apiService.getProductos(),
          apiService.getCategorias(),
          apiService.getAllSubcategorias()
        ]);
        setProductos(productosData);
        setCategorias(categoriasData);
        setSubcategorias(subcategoriasData);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsCategoryMenuOpen(false);
      }
    };

    if (isCategoryMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevenir scroll del body cuando el dropdown está abierto
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isCategoryMenuOpen]);

  // Cerrar dropdown con tecla Escape
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCategoryMenuOpen(false);
      }
    };

    if (isCategoryMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isCategoryMenuOpen]);

  const specialOffers = productos.slice(0, 2);

  // Create category options - solo categorías principales y subcategorías de la categoría seleccionada
  const getVisibleCategoryOptions = () => {
    const mainCategories = [
      { id: 'all' as const, denominacion: 'Todo', isMainCategory: true, parentId: null },
      ...categorias.map(cat => ({ ...cat, isMainCategory: true, parentId: null }))
    ];

    // Si hay una categoría principal seleccionada, mostrar sus subcategorías
    if (selectedCategory !== 'all' && categorias.some(cat => cat.id === selectedCategory)) {
      const selectedMainCategory = categorias.find(cat => cat.id === selectedCategory);
      const subcategoriesForSelected = selectedMainCategory?.subcategorias?.map(subcat => ({
        ...subcat,
        isMainCategory: false,
        parentId: selectedCategory
      })) || [];

      return [...mainCategories, ...subcategoriesForSelected];
    }

    return mainCategories;
  };

  const allCategoryOptions = getVisibleCategoryOptions();

  const filteredItems = selectedCategory === 'all'
    ? productos
    : productos.filter(item => {
      const isMainCategory = categorias.some(cat => cat.id === selectedCategory);
      if (isMainCategory) {
        const mainCategory = categorias.find(cat => cat.id === selectedCategory);
        const subcategoryDenominacion = mainCategory?.subcategorias.map(sub => sub.denominacion) || [];
        return subcategoryDenominacion.includes(item.denominacion);
      } else {
        const subCategoryId = subcategorias.find(sub => sub.id === selectedCategory);
        return subCategoryId?.denominacion === item.denominacion;
      }
    });

  const handleAddToCart = (producto: Producto) => {
    addToCart({
      id: producto.id,
      name: producto.denominacion,
      price: producto.precioVenta,
      quantity: 1
    });
  };

  const handleCategorySelect = (categoryId: number | 'all') => {
    setSelectedCategory(categoryId);
    // Solo cerrar el dropdown si se selecciona una subcategoría o "Todo"
    // Si se selecciona una categoría principal, mantener abierto para mostrar subcategorías
    if (categoryId === 'all' || subcategorias.some(sub => sub.id === categoryId)) {
      setIsCategoryMenuOpen(false);
    }
  };

  // Obtener el nombre de la categoría seleccionada
  const getSelectedCategoryName = () => {
    const selected = allCategoryOptions.find(cat => cat.id === selectedCategory);
    return selected?.denominacion || 'Todo';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-orange-600" size={48} />
          <p className="text-gray-600">Cargando menú...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-12">
      {/* Special Offers Section */}
      {specialOffers.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Ofertas Especiales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specialOffers.map(producto => (
              <div key={producto.id} className="bg-orange-50 rounded-xl p-6 transform transition hover:scale-105">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={producto.imagenes[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500'}
                    alt={producto.denominacion}
                    className="w-full md:w-48 h-48 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{producto.denominacion}</h3>
                    <p className="text-gray-600 mb-4">{producto.descripcion}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-orange-600">${producto.precioVenta}</span>
                      <button
                        onClick={() => handleAddToCart(producto)}
                        className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition"
                      >
                        Ordenar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Nuestro Menú</h2>
          
          {/* Mobile Category Selector - MEJORADO */}
          <div className="md:hidden relative">
            <button
              ref={buttonRef}
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-orange-700 transition-colors"
              aria-expanded={isCategoryMenuOpen}
              aria-haspopup="true"
            >
              <MenuIcon size={20} />
              <span className="max-w-32 truncate">{getSelectedCategoryName()}</span>
              <ChevronDown 
                size={16} 
                className={`transition-transform duration-200 ${
                  isCategoryMenuOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Mobile Categories Dropdown - MEJORADO */}
            {isCategoryMenuOpen && (
              <>
                {/* Overlay */}
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
                
                {/* Dropdown */}
                <div 
                  ref={dropdownRef}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-sm max-h-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 bg-orange-50 border-b">
                    <h3 className="font-semibold text-gray-800">Seleccionar Categoría</h3>
                    <button
                      onClick={() => setIsCategoryMenuOpen(false)}
                      className="p-1 hover:bg-orange-100 rounded-full transition-colors"
                    >
                      <X size={20} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Categories List */}
                  <div className="overflow-y-auto max-h-80">
                    {allCategoryOptions.map((category, index) => {
                      const isSelected = selectedCategory === category.id;
                      const isMainCategory = category.isMainCategory;
                      
                      return (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className={`w-full px-4 py-3 text-left transition-colors relative
                            ${isSelected
                              ? 'bg-orange-600 text-white' 
                              : 'hover:bg-orange-50 text-gray-700'
                            }
                            ${isMainCategory 
                              ? 'font-semibold border-b border-gray-100' 
                              : 'pl-8 text-sm'
                            }
                            ${index === 0 ? 'border-t border-gray-100' : ''}
                          `}
                        >
                          {/* Indicator for subcategories */}
                          {!isMainCategory && !isSelected && (
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full" />
                          )}
                          
                          {/* Selected indicator */}
                          {isSelected && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                          
                          <span className={isSelected ? 'font-medium' : ''}>
                            {category.denominacion}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Desktop Categories */}
        <div className="hidden md:block mb-8">
          {/* Main Categories */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full transition
                ${selectedCategory === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-100 hover:bg-orange-200'}`}
            >
              Todo
            </button>
            {categorias.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full transition font-semibold
                  ${selectedCategory === category.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-100 hover:bg-orange-200'}`}
              >
                {category.denominacion}
              </button>
            ))}
          </div>

          {/* Subcategories */}
          <div className="flex flex-wrap gap-2">
            {(() => {
              // Encuentra la categoría principal activa
              const mainCategory =
                selectedCategory === 'all'
                  ? null
                  : categorias.find(cat =>
                      cat.id === selectedCategory ||
                      cat.subcategorias.some(sub => sub.id === selectedCategory)
                    );
              // Si hay una categoría principal, muestra sus subcategorías
              if (mainCategory) {
                return mainCategory.subcategorias.map(subcategory => (
                  <button
                    key={subcategory.id}
                    onClick={() => setSelectedCategory(subcategory.id)}
                    className={`px-4 py-1 rounded-full text-sm transition
                      ${selectedCategory === subcategory.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  >
                    {subcategory.denominacion}
                  </button>
                ));
              }
              return null;
            })()}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map(producto => (
            <MenuItem
              key={producto.id}
              item={{
                name: producto.denominacion,
                price: producto.precioVenta,
                image: producto.imagenes[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500',
                description: producto.descripcion
              }}
              onAddToCart={() => handleAddToCart(producto)}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No hay productos disponibles en esta categoría.</p>
          </div>
        )}
      </section>
    </div>
  );
};



export default Menu;