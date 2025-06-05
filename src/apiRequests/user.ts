import http from "@/src/lib/httpAxios";
import {
  CommonResType,
  PagingBodyType,
} from "../schemaValidations/common.schema";

const userApiRequest = {
  getList: (body: PagingBodyType, sessionToken?: string) =>
    http.post<CommonResType>("/api/Account/get-list", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getListByAdmin: (body: PagingBodyType, sessionToken?: string) =>
    http.post<CommonResType>("/api/Account/get-list-by-admin", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getListByManager: (body: PagingBodyType, sessionToken?: string) =>
    http.post<CommonResType>("/api/Account/get-list-by-manager", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  updateProfile: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Account/update-profile", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  updateStaffProfile: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Account/update-staff-profile", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  reverseStaffStatusForManager: (body: any, sessionToken?: string) =>
    http.post<CommonResType>(
      "/api/Account/reverse-staff-status-for-manager",
      body,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),
  reverseStatusForAdmin: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Account/reverse-status-for-admin", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getProfile: (sessionToken: string) =>
    http.get("/api/Account/get-profile", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  getByPhoneOrEmail: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/Account/search-customer-by-phone-and-email", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),

};
export default userApiRequest;
