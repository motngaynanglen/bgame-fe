import { getCookie } from 'cookies-next';
import http from '../lib/httpAxios';

const API_URL = '/api/BookTable';

export const bookTableApiRequest = {
  createBookTableByCustomer: (body: any, sessionToken?: string) =>
    http.post(`${API_URL}/create-booktable-by-customer`, body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
    createBookTableByStaff: (body: any, sessionToken?: string) =>
    http.post(`${API_URL}/create-booktable-by-staff`, body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
    getBookTableTimeTableByDate: (body: any,sessionToken?: string) =>
    http.post(`${API_URL}/get-booktable-time-table-by-date`, body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
    getStoreTableList: (body: any,sessionToken?: string) =>
    http.post(`api/StoreTable/get-list-by-store-id`, body, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
    getbooklistbyDate: (body: Date,sessionToken?: string) =>
    http.get(`api/StoreTable/booklist?Date=${body.toISOString()}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),

}
export default bookTableApiRequest;