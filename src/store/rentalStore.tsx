import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  productTemplateID: string;
  quantity: number;
  product_name?: string; // Thêm trường product_name
  price?: number; // Thêm trường price
  image?: string;
  storeId?: string; 
}

interface RentalStore {
  cartItems: CartItem[];
  currentStoreId: string | null;
  setStoreId: (storeId: string) => void;
  addToCart: (productTemplateID: string, product_name?: string, image?: string, price?: number) => void; // Cập nhật addToCart
  removeFromCart: (productTemplateID: string) => void;
  updateQuantity: (productTemplateID: string, quantity: number) => void;
  clearCart: () => void;
  

  generateApiBody: (
    customerId: string,
    storeId: string,
    from: string,
    to: string,
    bookType: number
  ) => any;
}

export const useRentalStore = create<RentalStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      currentStoreId: null,

      setStoreId: (storeId: string) => {
        const prevStoreId = get().currentStoreId;
        if (prevStoreId && prevStoreId !== storeId) {
          // Nếu đổi cửa hàng, reset giỏ hàng
          set({ cartItems: [] });
        }
        set({ currentStoreId: storeId });
      },

      addToCart: (productTemplateID, product_name, image, price) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.productTemplateID === productTemplateID
          );

          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.productTemplateID === productTemplateID
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              cartItems: [
                ...state.cartItems,

                { productTemplateID, quantity: 1, product_name, image, storeId: state.currentStoreId ?? undefined, price }, // Lưu cả product_name và image
              ],
            };
          }
        }),

      removeFromCart: (productTemplateID) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => item.productTemplateID !== productTemplateID
          ),
        })),

      updateQuantity: (productTemplateID, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.productTemplateID === productTemplateID
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),

      clearCart: () => set({ cartItems: [] }),

      generateApiBody: (customerId, storeId, from, to, bookType) => {
        return {
          customerId,
          bookListItems: get().cartItems.map((item) => ({
            productTemplateID: item.productTemplateID,
            quantity: item.quantity,
          })),
          storeId,
          from,
          to,
          bookType,
        };
      },
      
    }),

    {
      name: "rentalCart",
      storage: {
        getItem: (product_name) => {
          const item = sessionStorage.getItem(product_name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (product_name, value) => {
          sessionStorage.setItem(product_name, JSON.stringify(value));
        },
        removeItem: (product_name) => {
          sessionStorage.removeItem(product_name);
        },
      },
    }
  )
);
