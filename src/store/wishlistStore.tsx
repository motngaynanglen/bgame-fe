import {create} from "zustand";

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

export const useWishlistStore = create<WishlistStore>((set, get) => ({
    wishlist: [],
    addToWishlist: (product: WishlistItem) =>
        set((state: WishlistStore) => {
            const existingItem: WishlistItem | undefined = state.wishlist.find((item: WishlistItem) => item.id === product.id);

            if (existingItem) {
                // Nếu sản phẩm đã có, không thêm vào danh sách
                return { wishlist: state.wishlist };
            } else {
                // Nếu sản phẩm chưa có, thêm sản phẩm mới
                return { wishlist: [...state.wishlist, product] };
            }
        }),
    removeFromWishlist: (productId: string) =>
        set((state: WishlistStore) => ({
            wishlist: state.wishlist.filter((item: WishlistItem) => item.id !== productId),
        })),
    clearWishlist: () => set({ wishlist: [] }),
}));