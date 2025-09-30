import { get } from "http";
import http from "../lib/httpAxios";
import { CommonResType } from "../schemaValidations/common.schema";

export const dashBoardApiRequest = {
  getStatistics: (sessionToken?: string) =>
    http.get<CommonResType>("/api/Dashboard/statistics", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getRevenue: (sessionToken?: string) =>
    http.get<CommonResType>("/api/Dashboard/revenue", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};
