import { useQuery } from "@tanstack/react-query";
import storeApiRequest from "../apiRequests/stores";
import { useCallback } from "react";
import { message } from "antd";

export interface Store {
  id: string;
  store_name: string;
  address: string;
  hotline: string;
  email: string;
  code: string;
  latitude: string;
  longitude: string;
}
interface UseStoresOptions {
  search?: string;
  filters?: string[];
  enabled?: boolean;
}

export const useStores = (options: UseStoresOptions = {}) => {
  // const { data, isLoading, isError, error } = useQuery<Store[]>({
  //   queryKey: ["stores"],
  //   queryFn: async () => {
  //     const res = await storeApiRequest.getList({
  //       search: "",
  //       filter: [""],
  //     });
  //     return res.data;
  //   },
  // });
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Store[]>({
    queryKey: ["stores", options.search, options.filters],
    queryFn: async () => {
      try {
        const res = await storeApiRequest.getRentals({
          search: options.search || "",
          filter: options.filters || [""],
        });
        return res.data;
      } catch (err) {
        // console.error("Error fetching stores:", err);
        message.error("Lỗi khi tải danh sách cửa hàng. Vui lòng thử lại sau.");
        return undefined;
      } finally {
        // console.log("stores", data);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 15 * 60 * 1000, // 15 phút (thay thế cho cacheTime)
    enabled: options.enabled !== false, // Mặc định true
  });
  const getStoreById = useCallback(
    (id: string) => {
      return data?.find((store) => store.id === id);
    },
    [data]
  );
  // const filterStoresByName = useCallback(
  //   (name: string) => {
  //     if (!name) return data || [];
  //     return (data || []).filter((store) =>
  //       store.store_name.toLowerCase().includes(name.toLowerCase())
  //     );
  //   },
  //   [data]
  // );
  return {
    stores: data || [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    getStoreById,
    // filterStoresByName,
  };
};