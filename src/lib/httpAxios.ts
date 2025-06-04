import envConfig from '@/src/config'
import axios, { AxiosError, AxiosInstance } from 'axios'
import { redirect } from 'next/navigation'
import { setStoredUser } from '../app/app-provider'

type CustomOptions = Omit<RequestInit, 'method'> & {
    baseUrl?: string | undefined
}

const STATUS_CODES = {
    OK: 200,
    ENTITY_ERROR: 422,
    AUTHENTICATION_ERROR: 401,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    // AUTHENTICATION_FAIL: 404,
    SERVER_ERROR: 500,
} as const;

interface Httpdata {
    [key: string]: unknown // "unknown" an toàn hơn "any"
}

export class HttpError extends Error {
    status: number
    message: string
    data: Httpdata

    constructor({ status, message, data }: { status: number; message: string; data: Httpdata }) {
        super(message || 'Http Error')
        this.status = status
        this.message = message
        this.data = data
    }
}

// Config HTTP ENTITY ERROR
type EntityErrordata = {
    message: string
    errors: EntityErrorField[]
}
type EntityErrorField = {
    field: string
    message: string
}
export class EntityError extends HttpError {
    status: 422 | 400
    message: string
    data: EntityErrordata
    constructor({ status, message, data }: { status: 422; message: string; data: EntityErrordata }) {
        super({ status, message, data })
        this.status = status
        this.message = message
        this.data = data
    }
}

// let clientLogoutRequest: null | Promise<any> = null
export const isClient = () => typeof window !== 'undefined'


// Get base URL
// Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_API_ENDPOINT
// Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server
const getBaseUrl = (customBaseUrl?: string): string => {
    if (customBaseUrl === undefined) {
        return envConfig.NEXT_API_ENDPOINT;
    }
    return customBaseUrl || envConfig.NEXT_URL;
};
const request = async <Response>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    options?: CustomOptions | undefined
) => {

    const baseUrl = getBaseUrl(options?.baseUrl);
    console.log("this is baseurl:" + baseUrl)
    const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

    let body: FormData | string | undefined = undefined
    if (options?.body instanceof FormData) {
        body = options.body
    } else if (options?.body) {
        body = JSON.stringify(options.body)
    }

    const baseHeaders: { [key: string]: string } =
        body instanceof FormData ? {} : {
            'Content-Type': 'application/json'
        };
    const axiosInstance: AxiosInstance = axios.create({
        timeout: 10000, // Timeout in milliseconds => 10s
        // withCredentials: true
    });
    const axiosConfig = {
        method,
        url: fullUrl,
        headers: {
            ...baseHeaders,
            ...options?.headers,
        },
        data: body,
    };

    try {
        console.log(axiosConfig);
        const response = await axiosInstance(axiosConfig);
        // const response = await axios(axiosConfig);
        console.log(response)
        return response.data;

    } catch (error: unknown) {
        //bởi vì axios sẽ nhảy trycatch nếu bị lỗi nên phải hander ở trong này.
        if (error instanceof AxiosError && error.response) {
            const { status, data: data } = error.response;

            if (status === STATUS_CODES.ENTITY_ERROR) {
                throw new EntityError({
                    status: STATUS_CODES.ENTITY_ERROR,
                    message: data.message || 'Validation error',
                    data: data as EntityErrordata,
                });
            } else if (status === STATUS_CODES.SERVER_ERROR) {
                throw new HttpError({
                    status: STATUS_CODES.SERVER_ERROR,
                    message: 'Server error',
                    data: data,
                });
            } else if (status === STATUS_CODES.AUTHENTICATION_ERROR) {
                setStoredUser(null); // Xóa thông tin người dùng khỏi localStorage

                // if (typeof window !== 'undefined') {
                //     window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập
                //   }
                throw new HttpError({
                    status: STATUS_CODES.AUTHENTICATION_ERROR,
                    message: 'Authentication error',
                    data: data,
                });
            } else if (status === STATUS_CODES.NOT_FOUND) {
                throw new HttpError({
                    status: STATUS_CODES.NOT_FOUND,
                    message: 'Resource not found',
                    data: data,
                });
            }else if (status === STATUS_CODES.ENTITY_ERROR) {
                throw new HttpError({
                    status: STATUS_CODES.ENTITY_ERROR,
                    message: 'Lỗi logic khi tạo dữ liệu',
                    data: data,
                });
            }else if (status === STATUS_CODES.BAD_REQUEST) {
                throw new HttpError({
                    status: STATUS_CODES.BAD_REQUEST,
                    message: 'Lỗi logic khi tạo dữ liệu',
                    data: data,
                });
            }
        }
        throw error;
    }
};

// Interceptor là nời chúng ta xử lý request và response trước khi trả về cho phía component

// Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)

const http = {
    get<Response>(
        url: string,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('GET', url, options)
    },
    post<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('POST', url, { ...options, body })
    },
    put<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('PUT', url, { ...options, body })
    },
    delete<Response>(
        url: string,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('DELETE', url, { ...options })
    }
}

export default http;