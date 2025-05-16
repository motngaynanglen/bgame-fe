import http from "@/src/lib/httpAxios";
import { CommonResType } from "../schemaValidations/common.schema";

const consignmentApiRequest = {
  createConsignment: (body: any, sessionToken?: string) =>
    http.post<CommonResType>("/api/ConsignmentOrder/create", body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
};

export default consignmentApiRequest;
