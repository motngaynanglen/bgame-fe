import productApiRequest from "@/src/apiRequests/product";
import { ProductResType } from "@/src/schemaValidations/product.schema";
import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { useCallback } from "react";
import { ProductQuery } from "./productQueries";
import { productApiStrategies } from "./productStrategies";

interface UseProductOptions {
    query: ProductQuery;
    authToken?: string;
    enabled?: boolean;
}

export const useProduct = (options: UseProductOptions) => {
    // const enabled = (options.enabled ?? true) && !!options.templateID && options.conditionFilter !== undefined;
    const queryFnCustom = async () => {
        switch (options.query.type) {
            case "GET_BY_ID":
                // return productApiRequest.getById(options.query);
                return await productApiStrategies.GET_BY_ID(options.query, options.authToken);
            case "GET_LIST_BY_TEMPLATE_ID":
                // return productApiRequest.getListByTempId(options.query, options.authToken);
                return await productApiStrategies.GET_LIST_BY_TEMPLATE_ID(options.query, options.authToken);
            // Thêm các phương thức khác nếu cần
            default:
                throw new Error("Lỗi không tìm thấy phương thức đúng");
        }
    }
    const { data, isLoading, isError, error, refetch, isRefetching, ...queryResult } = useQuery<ProductResType[]>({

        queryKey: ["products", options.query.type, options.query.params],
        queryFn: () => queryFnCustom(),
        enabled: options.enabled ?? true,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });

    const getProductById = useCallback((id: string) => {
        return data?.find((product) => product.id === id);
    }, [data]
    );

    return {
        products: data || [],
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
        getProductById,
        ...queryResult

    };
};
