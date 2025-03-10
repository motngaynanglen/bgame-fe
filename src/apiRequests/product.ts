import http from '@/src/lib/httpAxios';
import { CommonResType } from '../schemaValidations/common.schema';

const productApiRequest = {
    getList: (body: any) => http.post<CommonResType>('/api/Product/search', body),
    getListByStoreId: (body: any) => http.post<CommonResType>('/api/Product/search-by-store-id', body),
    createTemplate: (body: any) => http.post<CommonResType>('/api/Product/create-template', body),
    addProduct: (body: any) => http.post<CommonResType>('/api/Product/create-product', body),
    addNonExistProduct: (body: any) => http.post<CommonResType>('/api/Product/create-product-unknown', body),

}
export default productApiRequest;