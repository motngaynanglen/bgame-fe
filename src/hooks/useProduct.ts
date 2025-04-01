import { useQuery } from "@tanstack/react-query";
import productApiRequest from "../apiRequests/product";

interface BoardGame {
  id: string;
  product_group_ref_id: string;
  product_name: string;
  sell_price: number;
  status: boolean;
  image: string;
  sales_quantity: number;
  rent_quantity: number;
  publisher: string;
  category: string;
  player: string;
  time: string;
  age: number;
  complexity: number;
}

interface responseModel {
  data: BoardGame[];
  message: string;
  statusCode: number;
  paging: {
    pageNum: number; // Thay đổi kiểu dữ liệu
    pageSize: number; // Thay đổi kiểu dữ liệu
    pageCount: number; 
  };
}

export const useProducts = (pageNum: number = 1, pageSize: number = 15) => {
  const { data, isLoading, isError, error, refetch } = useQuery<responseModel>({
    queryKey: ["boardGames", pageNum, pageSize],
    queryFn: async () => {
      const res = await productApiRequest.getList({
        search: "",
        filter: [],
        paging: {
            pageNum,
            pageSize,
        },
      });
      return res;
    },
    // keepPreviousData: true,
  });


  return {
    products: data?.data || [],
    isLoading,
    isError,
    error,
    pageCount: data?.paging?.pageCount || 1,
    pageNum: data?.paging?.pageNum || 1,
    pageSize: data?.paging?.pageSize || 10,
    refetch,
  };
};
