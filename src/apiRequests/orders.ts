import http from "@/src/lib/httpAxios";
import { CommonResType } from "../schemaValidations/common.schema";

export const orderApiRequest = {
  getList: (body: any) => http.post<CommonResType>("/api/Order/search", body),
  createOrderByCustomer: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Order/create-order-by-customer", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  createOrderByStaff: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Order/create-order-by-staff", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  cancelOrderByCustomer: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Order/cancel-order-by-customer", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  updateOrderToSent: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Order/update-order-to-sent", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  updateOrderToPrepared: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Order/update-order-to-prepared", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  updateOrderDeliveryInfo: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Order/update-order-delivery-info", body, {
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

export const orderItemApiRequest = {
  updateOrderItem: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/OrderItem/update-orderitem-product", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};
