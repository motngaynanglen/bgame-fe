import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface WishlistStore {
  wishlist: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],
      addToWishlist: (product: WishlistItem) =>
        set((state) => {
          const existingItem: WishlistItem | undefined = state.wishlist.find(
            (item) => item.id === product.id
          );

          if (existingItem) {
            return { wishlist: state.wishlist };
          } else {
            return { wishlist: [...state.wishlist, product] };
          }
        }),
      removeFromWishlist: (productId: string) =>
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== productId),
        })),
      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: 'wishlist',
      storage: {
        getItem: (name: string) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name: string, value: any) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name: string) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);