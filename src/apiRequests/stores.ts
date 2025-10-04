import http from "@/src/lib/httpAxios";
import { CommonResType } from "../schemaValidations/common.schema";
import { get } from "http";

const storeApiRequest = {
  getList: (body: any) => http.post<CommonResType>("/api/Store/list", body),
  getListByProductGroupRefId: (body: any) =>
    http.post<CommonResType>("/api/Store/get-list-by-group-ref-id", body),
  getListAndProductCountById: (id: any) =>
    http.get<CommonResType>(
      `/api/Store/product-template/${id}/list`,
    ),
  getStoreId: (sessionToken: any) =>
    http.get<CommonResType>("/api/Store/get-store-id", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getRentals: (body: any) =>
    http.post<CommonResType>("/api/Store/rentals", body),
  create: (body: any) => http.post<CommonResType>("/api/Store", body),
  getDetail: (id: any, sessionToken: any) =>
    http.get<CommonResType>(`/api/Store/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  changeStatus: (id: any, sessionToken: any) =>
    http.post<CommonResType>(
      `/api/Store/${id}/status`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),
  update: ( body: any, sessionToken: any) =>
    http.put<CommonResType>(`/api/Store`, body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};
export default storeApiRequest;
