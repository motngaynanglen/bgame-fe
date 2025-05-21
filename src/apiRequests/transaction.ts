import http from "../lib/httpAxios";

const transactionApiRequest = {
    performTransaction: (body: any, sessionToken?: string) =>
        http.post<any>("/api/Transaction/perform-transaction", body, {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
            },
        }),
}
export default transactionApiRequest;