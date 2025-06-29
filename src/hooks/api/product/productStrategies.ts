import productApiRequest from "@/src/apiRequests/product";
import { GetByIdQuery, GetListByTemplateQuery, ProductQuery } from "./productQueries";
import { ProductResPagingType, ProductResType } from "@/src/schemaValidations/product.schema";
import { message } from "antd";
import { AxiosError } from "axios";

type ProductApiStrategy = {
    [K in ProductQuery['type']]: (
        query: Extract<ProductQuery, { type: K }>,
        authToken: string | undefined
    ) => Promise<ProductResPagingType>;
};
export const productApiStrategies: ProductApiStrategy = {
    GET_BY_ID: async (query: GetByIdQuery) => {
        try {
            const body = query.params;
            const res = await productApiRequest.getById(body);
            return {
                products: [res.data],
                paging: null,
            };
        } catch (err) {
            message.error("Lỗi khi tải sản phẩm. Vui lòng thử lại sau.");
            throw err;
        }
    },
    GET_LIST_BY_TEMPLATE_ID: async (query: GetListByTemplateQuery, authToken: string | undefined) => {
        try {
            if (!authToken) {
                throw new Error("Hãy đăng nhập để thực hiện thao tác này.");
            }
            const body = query.params;
            const res = await productApiRequest.getListByTempId(body, authToken);

            return res.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 404) {
                    message.error(err.response.data.message || "Không tìm thấy sản phẩm nào.");
                    return [];
                };
                message.error("Lỗi khi tải danh sách sản phẩm. Vui lòng thử lại sau.");
                throw err;
            }
        }
    }
};