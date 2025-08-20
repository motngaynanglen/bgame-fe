import { create } from "zustand";
import { persist } from "zustand/middleware";

//version 2: add cartStore interface để lưu trữ store name và location cho cart

interface CartItem {
  productTemplateID: string;
  quantity: number;
  name?: string;
  price?: number; // Thêm trường price
  image?: string;
  storeId?: string;
}
interface CartStore {
  storeId: string;
  storeName: string;
  storeLocation: string;
}
interface RentalStore {
  cartItems: CartItem[];
  currentStoreId: string | null;
  cartStore: CartStore | null;

  setStoreInfo: (storeId: string, storeName: string, storeLocation: string) => void;
  setStoreId: (storeId: string) => void;

  addToCart: (productTemplateID: string, name?: string, image?: string, price?: number) => void; 
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
      cartStore: null,

      setStoreInfo: (storeId, storeName, storeLocation) => { // update form version 2
        const prevStoreId = get().currentStoreId;
        if (prevStoreId && prevStoreId !== storeId) {
          set({ cartItems: [] }); 
        }
        set({
          currentStoreId: storeId,
          cartStore: { storeId, storeName, storeLocation },
        });
      },
      setStoreId: (storeId: string) => { //update form version 2
         const prevStoreId = get().currentStoreId;
        if (prevStoreId && prevStoreId !== storeId) {
          set({ cartItems: [] });
        }
        const currentInfo = get().cartStore;
        set({
          currentStoreId: storeId,
          cartStore: currentInfo
            ? { ...currentInfo, storeId }
            : { storeId, storeName: "", storeLocation: "" }, // fallback khi chưa có store info
        });
      },

      addToCart: (productTemplateID, name, image, price) =>
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

                { productTemplateID, quantity: 1, name, image, storeId: state.currentStoreId ?? undefined, price }, // Lưu cả name và image
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
