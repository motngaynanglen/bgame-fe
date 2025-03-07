import http from '@/src/lib/httpAxios';
import { CommonResType } from '../schemaValidations/common.schema';

const storeApiRequest = {
    getList: (body: any) => http.post<CommonResType>('/api/Store/get-list', body),
    getListByProductGroupRefId: (body: any) => http.post<CommonResType>('/api/Store/get-list-by-group-ref-id', body),

}
export default storeApiRequest;