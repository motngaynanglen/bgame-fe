import http from "@/src/lib/httpAxios";
import { CommonResType } from "../schemaValidations/common.schema";
import { get } from "http";

const categoryApiRequest = {
  createCategory: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Category/create-category", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getCategoryList: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Category/get-category", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getCategoryByAdmin: (body: any, sessionToken?: string) =>
    http.post<CommonResType>(`/api/Category/get-category-by-admin`, body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  updateCategory: (body: any, sessionToken?: string) =>
    http.post<CommonResType>(`/api/Category/update-category`, body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  deactiveCategory: (body: any, sessionToken?: string) =>
    http.post<CommonResType>(`/api/Category/deactivate-category`, body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};

export default categoryApiRequest;
