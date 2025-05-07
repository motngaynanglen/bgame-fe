import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string | null | undefined;
  image: string;
  price: number ;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: CartItem, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  calculateTotal: () => number;
  updateQuantity: (productId: string, quantity: number) => void; // Thêm hàm này
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          } else {
            return { cart: [...state.cart, { ...product, quantity }] };
          }
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),

      clearCart: () => set({ cart: [] }),

      calculateTotal: () =>
        get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),

      updateQuantity: (productId, quantity) => // Thêm hàm này
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        })),
    }),
    {
      name: 'cart',
      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);