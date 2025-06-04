import http from "../lib/httpAxios";
import { CommonResType } from "../schemaValidations/common.schema";

const productGroupApiRequest = {
  getList: (body: any) => http.post<CommonResType>("/api/ProductGroup/get-list", body),
  addProductGroup: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/ProductGroup/create", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }), 
  updateProductGroup: (body: { code: string }, sessionToken?: string) =>
    http.post<CommonResType>("/api/ProductGroup/update-product-group", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};
export default productGroupApiRequest;
