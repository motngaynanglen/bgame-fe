import http from '@/src/lib/httpAxios';
import { CommonResType } from '../schemaValidations/common.schema';

const uploadApiRequest = {
    uploadImage: (body: FormData, sessionToken?: string) => http.post<CommonResType>('/api/upload/images', body, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${sessionToken}`,
        },
    }),

}
export default uploadApiRequest;