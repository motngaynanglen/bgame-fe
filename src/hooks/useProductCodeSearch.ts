import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useDebounce } from "use-debounce"; // ✅ Import đúng từ thư viện
// Giả định productApiRequest đã được import
import productApiRequest from "../apiRequests/product";

interface ProductCodeOption {
    value: string; // Mã code
    label: string; // Hiển thị trên Autocomplete (có thể là Mã + Tên)
}

/**
 * Hook để tìm kiếm mã sản phẩm theo code
 * @param token Token xác thực của người dùng
 * @param productType Loại sản phẩm cần tìm (0: Hàng book, 1: Hàng mua).
 */
export const useProductCodeSearch = (token: string | undefined, productType: 0 | 1) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    // Nó sẽ trả về giá trị của searchTerm sau khi người dùng ngừng gõ 500ms
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    // Logic kiểm tra điều kiện kích hoạt query
    const shouldFetch =
        !!debouncedSearchTerm &&
        debouncedSearchTerm.length >= 1 &&
        !!token;


    // Hàm gọi API tìm kiếm
    const { data: searchData, isLoading: isSearching } = useQuery({
        queryKey: ['productCodesSearch', debouncedSearchTerm, productType],
        queryFn: async () => {
            // Kiểm tra lại điều kiện trong queryFn để đảm bảo an toàn
            if (!shouldFetch) {
                return [];
            }
            try {
                const res = await productApiRequest.getByCode({
                    code: debouncedSearchTerm,
                    productType: productType
                }, token);
                return res.data;
            } catch (error) {
                console.error("Lỗi tìm kiếm mã sản phẩm:", error);
                return [];
            }
        },
        enabled: shouldFetch,
        staleTime: 5 * 60 * 1000,
    });

    // Chuyển đổi dữ liệu API sang định dạng cho Autocomplete
    const options: ProductCodeOption[] = useMemo(() => {
        if (!searchData) return [];
        return searchData.map((item: any) => ({
            value: item.code,
            label: `${item.code}`,
        }));
    }, [searchData]);

    return {
        options,
        isSearching,
        // ✅ Chỉ cần trả về searchTerm và setSearchTerm
        searchTerm,
        setSearchTerm,
    };
};