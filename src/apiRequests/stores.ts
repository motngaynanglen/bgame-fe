import http from "@/src/lib/httpAxios";
import { CommonResType } from "../schemaValidations/common.schema";
import { get } from "http";

const storeApiRequest = {
  create: (body: any) => http.post<CommonResType>("/api/Store", body),
  // update: (body: any) => http.put<CommonResType>("/api/Store", body),
  getList: (body: any) => http.post<CommonResType>("/api/Store/list", body),
  getRentals: (body: any) => http.post<CommonResType>("/api/Store/rentals", body),

  getListByProductGroupRefId: (body: any) => http.post<CommonResType>("/api/Store/group-ref", body),
  getListAndProductCountById: (parameter: string) =>
    http.get<CommonResType>(
      `/api/Store/product-template/${parameter}/list`,
    ),
  getStoreId: (sessionToken: any) =>
    http.get<CommonResType>("/api/Store/my", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
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
