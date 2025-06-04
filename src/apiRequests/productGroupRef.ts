import http from "../lib/httpAxios";
import { CommonResType } from "../schemaValidations/common.schema";

const productGroupRefApiRequest = {
  getListByGroupId: (body: any) => http.post<CommonResType>("/api/ProductGroupRef/get-list", body),
  addProductGroupRef: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/ProductGroupRef/create", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }), 
  updateProductRefGroup: (body: { code: string }, sessionToken?: string) =>
    http.post<CommonResType>("/api/ProductGroupRef/update-product-group-ref", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};
export default productGroupRefApiRequest;
