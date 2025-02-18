import {create} from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: CartItem, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  calculateTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  
  addToCart: (product, quantity = 1) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);

      if (existingItem) {
        // Nếu sản phẩm đã có, cập nhật số lượng
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      } else {
        // Nếu sản phẩm chưa có, thêm sản phẩm mới
        return { cart: [...state.cart, { ...product, quantity }] };
      }
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),

  clearCart: () => set({ cart: [] }),
  calculateTotal: () =>
    get().cart.reduce((total, item) => total + item.price * item.quantity, 0),
}));
