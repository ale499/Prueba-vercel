import { create } from 'zustand'

export interface Product {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: Product[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
  updateQuantity: (productId: number, quantity: number) => void
  totalPrice: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addToCart: (product) => {
    const items = get().items
    const existing = items.find(item => item.id === product.id)
    
    if (existing) {
      set({
        items: items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        )
      })
    } else {
      set({ items: [...items, product] })
    }
  },

  removeFromCart: (productId) => {
    set({
      items: get().items.filter(item => item.id !== productId)
    })
  },

  updateQuantity: (productId, quantity) => {
    set({
      items: get().items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    })
  },

  clearCart: () => set({ items: [] }),

  totalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
  }
}))
