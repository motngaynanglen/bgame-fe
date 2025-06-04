import http from "@/src/lib/httpAxios";
import { CommonResType } from "../schemaValidations/common.schema";
import { get } from "http";

const consignmentApiRequest = {
  createConsignment: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/ConsignmentOrder/create", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getConsignmentList: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/ConsignmentOrder/get-list", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getConsignmentById: (body: any, sessionToken?: string) =>
    http.post<CommonResType>(`/api/ConsignmentOrder/get-by-id`, body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  updateConsignment: (body: any, sessionToken?: string) =>
    http.post<CommonResType>(`/api/ConsignmentOrder/update`, body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  deleteConsignment: (body: any, sessionToken?: string) =>
    http.post<CommonResType>(`/api/ConsignmentOrder/cancel`, body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};

export default consignmentApiRequest;
