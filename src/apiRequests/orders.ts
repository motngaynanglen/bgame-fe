import http from "@/src/lib/httpAxios";
import { CommonResType } from "../schemaValidations/common.schema";

export const orderApiRequest = {
  getList: (body: any) => http.post<CommonResType>("/api/Order/search", body),
  createOrder: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Order/create-order", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getOrderHistory: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Order/get-order-history", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
    getOrderById: (body: any, sessionToken?: string) => 
    http.post<CommonResType>("/api/Order/get-by-id", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};
