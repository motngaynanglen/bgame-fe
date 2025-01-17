import http from '@/src/lib/httpAxios'
import { MessageResType } from '../schemaValidations/common.schema';

const contentApiRequest = {
    getAboutUs: () =>
        http.get<MessageResType>('/api/content', {
            baseUrl: ''
        }),
}
export default contentApiRequest;