import { create } from "zustand";
import { persist } from "zustand/middleware";
import storeApiRequest from "../apiRequests/stores";
// Import API call của bạn

type Store = {
  id: string;
  store_name: string;
  address: string;
  hotline: string;
  email: string;
  code: string;
  lattitude: string;
  longitude: string;
};

type StoreState = {
  stores: Store[]; // Lưu danh sách cửa hàng
  selectedStoreId: string | null; // ID cửa hàng đang chọn
  fetchStores: () => Promise<void>; // Hàm fetch API
  setSelectedStore: (storeId: string) => void; // Hàm chọn cửa hàng
};

export const useStoreStore = create<StoreState>()(
  persist(
    (set, get) => ({
      stores: [],
      selectedStoreId: null,
      fetchStores: async () => {
        try {
          if (get().stores.length > 0) return; // Nếu đã có dữ liệu thì không fetch lại

          const res = await storeApiRequest.getList({
            search: "",
            filter: [""],
          });
          const stores = res.data.map((item: Store) => ({
            id: item.id,
            store_name: item.store_name,
            address: item.address,
          }));

          set({ stores });
          if (stores.length > 0) {
            set({ selectedStoreId: stores[0].id }); // Mặc định chọn cửa hàng đầu tiên
          }
        } catch (error) {
          console.error("Lỗi khi fetch cửa hàng: ", error);
        }
      },
      setSelectedStore: (storeId) => set({ selectedStoreId: storeId }),
    }),
    { name: "store-storage" }
  )
);

