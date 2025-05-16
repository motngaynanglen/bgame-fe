import http from "@/src/lib/httpAxios";
import { CommonResType } from "../schemaValidations/common.schema";

const productApiRequest = {
  getList: (body: any) => http.post<CommonResType>("/api/Product/search", body),
  getListByStoreId: (body: any) =>
    http.post<CommonResType>("/api/Product/search-by-store-id", body),
  getListByRole: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Product/search-store", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  createTemplate: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Product/create-template", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  addProduct: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Product/create-product", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  addNonExistProduct: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Product/create-product-unknown", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getby: (body: any) => http.post<CommonResType>("/api/Product/get-by", body),
  getById: (body: any) =>
    http.post<CommonResType>("/api/Product/get-by-id", body),
  getListByTempId: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Product/get-by-template-condition", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getByCode: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Product/get-by-code", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  updateToRent: (body: { code: string }, sessionToken?: string) =>
    http.post<CommonResType>("/api/Product/change-product-to-rent", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  updateToSale: (body: { code: string }, sessionToken?: string) =>
    http.post<CommonResType>("/api/Product/change-product-to-sales", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};
export default productApiRequest;
