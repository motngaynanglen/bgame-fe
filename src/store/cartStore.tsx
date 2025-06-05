import { create } from "zustand";
import { persist } from "zustand/middleware";


export interface StoreItem {
  id: string;
  name: string;
  quantity: number;
}
export interface CartItem {
  id: string;
  name: string | null | undefined;
  image: string;
  price: number;
  quantity: number;
  storeId?: string | null; 
  storeList?: StoreItem[] | null ; 
}


interface CartStore {
  cart: CartItem[];
  addToCart: (product: CartItem, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  calculateTotal: () => number;
  updateQuantity: (productId: string, quantity: number) => void;
  buyNowItem: CartItem | null;
  setBuyNowItem: (item: CartItem | null, quantity?: number) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      buyNowItem: null,

      addToCart: (product, quantity = 1) =>
        set((state) => {
          const imageUrl =product.image.split('||')[0]
          const existingItem = state.cart.find(
            (item) => item.id === product.id
          );

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity, image: imageUrl }
                  : item
              ),
            };
          } else {
            return { cart: [...state.cart, { ...product, quantity, image: imageUrl }] };
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

      updateQuantity: (
        productId,
        quantity 
      ) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        })),

      

      setBuyNowItem: (item) => set({ buyNowItem: item }),
    }),
    {
      name: "cart",
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
