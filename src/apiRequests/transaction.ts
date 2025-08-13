import http from "../lib/httpAxios";

const transactionApiRequest = {
    performTransaction: (body: any, sessionToken?: string) =>
        http.post<any>("/api/Transaction/perform-transaction", body, {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
            },
        }),
    getTransactionStatusByRefId: (body: any, token?: string) =>
        http.post<any>(`/api/Transaction/get-by-ref-id`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
}
export default transactionApiRequest;