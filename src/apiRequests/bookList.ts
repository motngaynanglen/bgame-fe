import http from "@/src/lib/httpAxios";
import { CommonResType } from "../schemaValidations/common.schema";

export const bookListApiRequest = {
  createBookList: (body: any, sessionToken?: string) =>
    http.post<CommonResType>(
      "/api/BookList/create-booklist-by-customer",
      body,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),
  endBookList: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/BookList/end-booklist", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  startBookList: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/BookList/start-booklist", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getBookListByDate: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/BookList/get-booklist-by-date", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getBookAvailableSlot: (body: any) =>
    http.post<CommonResType>("/api/BookList/get-booklist-available-slot", body),
  getBookAvailableProduct: (body: any) =>
    http.post<CommonResType>(
      "/api/BookList/get-booklist-available-product",
      body
    ),

  getBookListHistory: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/BookList/get-booklist-history", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),

  getBookListById: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/BookList/get-by-id", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),

  updateBookItemProduct: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/BookItem/update-bookitem-product", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};
export default bookListApiRequest;
