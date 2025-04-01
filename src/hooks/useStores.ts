import { useQuery } from "@tanstack/react-query";
import storeApiRequest from "../apiRequests/stores";

interface Store {
  id: string;
  store_name: string;
  address: string;
  hotline: string;
  email: string;
  code: string;
  latitude: string;
  longitude: string;
}

export const useStores = () => {
  const { data, isLoading, isError, error } = useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      const res = await storeApiRequest.getList({
        search: "",
        filter: [""],
      });
      return res.data;
    },
  });

  return {
    stores: data || [],
    isLoading,
    isError,
    error,
  };
};