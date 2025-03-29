import http from '@/src/lib/httpAxios';
import { CommonResType } from '../schemaValidations/common.schema';

const bookListApiRequest = {

    createBookList: (body: any, sessionToken?: string) => http.post<CommonResType>('/api/BookList/create-booklist', body, {
        headers: {
            Authorization: `Bearer ${sessionToken}`
        }
    }),
    endBookList: (body: any, sessionToken?: string) => http.post<CommonResType>('/api/BookList/end-booklist', body, {
        headers: {
            Authorization: `Bearer ${sessionToken}`
        }
    }),
    getBookListByDate: (body: any, sessionToken?: string) => http.post<CommonResType>('/api/BookList/get-booklist-by-date', body, {
        headers: {
            Authorization: `Bearer ${sessionToken}`
        }
    }),


}
export default bookListApiRequest;