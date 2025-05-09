import {
  keepPreviousData,
  useQuery
} from "@tanstack/react-query";
import productApiRequest from "../apiRequests/product";

interface BoardGame {
  id: string;
  product_group_ref_id: string;
  product_name: string;
  sell_price: number;
  code: string;
  image: string;
  publisher: string;
  category: string;
  player: string;
  complexity: number;
  age: string;
  number_of_players_min: number;
  number_of_players_max: number;
  hard_rank: number;
  time: string;
  description: string;
  sales_quantity: number;
  rent_quantity: number;
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

export const useProducts = (currentPage: number = 1, pageSize: number = 15) => {
  const { data, isLoading, isError, error } = useQuery<responseModel>({
    queryKey: ["boardGames", currentPage, pageSize],
    queryFn: async () => {
      const res = await productApiRequest.getList({
        search: "",
        filter: [],
        paging: {
          pageNum: currentPage,
          pageSize,
        },
      });
      return res;
    },
    placeholderData: keepPreviousData,
  });

  return {
    products: data?.data || [],
    isLoading,
    isError,
    error,
    pageCount: data?.paging?.pageCount || 1,
    pageNum: data?.paging?.pageNum || 1,
    pageSize: data?.paging?.pageSize || 15,
  };
};

export const useProduct = (id: string) => {
  const { data, isLoading, isError, error } = useQuery<BoardGame>({
    queryKey: ["boardGame", id],
    queryFn: async () => {
      const res = await productApiRequest.getById({ productId: id });
      return res;
    },
   
  });

  return {
    product: data,
    isLoading,
    isError,
    error,
  };
};

// export const useProduct = (id: string) => {
//   const queryClient = useQueryClient();
//   const { data, isLoading, isError, error } = useQuery<BoardGame>({
//     queryKey: ["boardGame", id],
//     queryFn: async () => {
//       const res = await productApiRequest.getById(id);
//       return res;
//     },
//     placeholderData: () => {
//       return queryClient.getQueryData<BoardGame[]>(["boardGames"])?.find((item) => item.id === id);
//     },
//   });

//   return {
//     product: data,
//     isLoading,
//     isError,
//     error,
//   };
// };
