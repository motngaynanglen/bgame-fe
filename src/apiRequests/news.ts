import http from "../lib/httpAxios";
import { CommonResType } from "../schemaValidations/common.schema";

export const newsApiRequest = {
  getNews: (body: any) => http.post<CommonResType>("/api/News/get-news", body),
  getNewsById: (body: any) =>
    http.post<CommonResType>("/api/News/get-by-id", body),
};
