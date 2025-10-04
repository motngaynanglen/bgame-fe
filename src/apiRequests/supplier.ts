import http from "@/src/lib/httpAxios";
import { CommonResType } from "../schemaValidations/common.schema";
import { get } from "http";
import { update } from "@react-spring/web";

const supplierApiRequest = {
  get: (body: any, sessionToken: any) =>
    http.post<CommonResType>("/api/Supplier/get-list-supplier", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  create: (body: any) =>
    http.post<CommonResType>("/api/Supplier/create-supplier", body),
  getDetail: (body: any, sessionToken: any) =>
    http.post<CommonResType>(`/api/Supplier/get-by-id-supplier`,body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  update: (body: any, sessionToken: any) =>
    http.put<CommonResType>(`/api/Supplier/update-supplier`, body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),

  getSuppilerOrder: (body: any, sessionToken: any) =>
    http.post<CommonResType>("/api/SupplyOrder/list", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  createSuppilerOrder: (body: any, sessionToken: any) =>
    http.post<CommonResType>("/api/SupplyOrder/create-supply-order", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getSuppilerOrderDetail: (id: any, sessionToken: any) =>
    http.get<CommonResType>(`/api/SupplyOrder/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
    updateSuppilerItemPrice: (body: any, sessionToken: any) =>
    http.post<CommonResType>(`/api/SupplyItem/update-supply-item-price`, body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
    updateProductQuantity: (body: any, sessionToken: any) =>
    http.post<CommonResType>(`/api/Product/add-product-from-supply-item`, body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};
export default supplierApiRequest;
