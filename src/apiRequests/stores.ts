import http from "@/src/lib/httpAxios";
import { CommonResType } from "../schemaValidations/common.schema";
import { get } from "http";

const storeApiRequest = {
  getList: (body: any) => http.post<CommonResType>("/api/Store/get-list", body),
  getListByProductGroupRefId: (body: any) =>
    http.post<CommonResType>("/api/Store/get-list-by-group-ref-id", body),
  getListAndProductCountById: (body: any) =>
    http.post<CommonResType>(
      "/api/Store/get-list-by-product-template-id",
      body
    ),
  getStoreId: (sessionToken: any) =>
    http.get<CommonResType>("/api/Store/get-store-id", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getRentals: (body: any) => http.post<CommonResType>("/api/Store/get-rentals", body),
  create: (body: any) => http.post<CommonResType>("/api/Store/create", body),
  getDetail: (id: any, sessionToken: any) => http.get<CommonResType>(`/api/Store/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};
export default storeApiRequest;
