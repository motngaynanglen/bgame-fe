import envConfig from '@/src/config'
import axios, { AxiosError, AxiosInstance } from 'axios'
import { redirect } from 'next/navigation'

type CustomOptions = Omit<RequestInit, 'method'> & {
    baseUrl?: string | undefined
}

const STATUS_CODES = {
    OK: 200,
    ENTITY_ERROR: 422,
    AUTHENTICATION_ERROR: 401,
    NOT_FOUND: 400,
    AUTHENTICATION_FAIL: 404,
    SERVER_ERROR: 500,
} as const;

interface HttpPayload {
    [key: string]: unknown // "unknown" an toàn hơn "any"
}

export class HttpError extends Error {
    status: number
    message: string
    payload: HttpPayload

    constructor({ status, message, payload }: { status: number; message: string; payload: HttpPayload }) {
        super(message || 'Http Error')
        this.status = status
        this.message = message
        this.payload = payload
    }
}

// Config HTTP ENTITY ERROR
type EntityErrorPayload = {
    message: string
    errors: EntityErrorField[]
}
type EntityErrorField = {
    field: string
    message: string
}
export class EntityError extends HttpError {
    status: 422
    message: string
    payload: EntityErrorPayload
    constructor({ status, message, payload }: { status: 422; message: string; payload: EntityErrorPayload }) {
        super({ status, message, payload })
        this.status = status
        this.message = message
        this.payload = payload
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
        withCredentials: true
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
        console.log(fullUrl)
        const response = await axiosInstance(axiosConfig);

        return response.data.payload ?? response.data;
    } catch (error: unknown) {
        //bởi vì axios sẽ nhảy trycatch nếu bị lỗi nên phải hander ở trong này.
        if (error instanceof AxiosError && error.response) {
            const { status, data: payload } = error.response;

            if (status === STATUS_CODES.ENTITY_ERROR) {
                throw new EntityError({
                    status: STATUS_CODES.ENTITY_ERROR,
                    message: payload.message || 'Validation error',
                    payload: payload as EntityErrorPayload,
                });
            } else if (status === STATUS_CODES.SERVER_ERROR) {
                throw new HttpError({
                    status: STATUS_CODES.SERVER_ERROR,
                    message: 'Server error',
                    payload: payload,
                });
            } else if (status === STATUS_CODES.AUTHENTICATION_FAIL) {
                throw new HttpError({
                    status: STATUS_CODES.AUTHENTICATION_FAIL,
                    message: 'Invalid credentials',
                    payload: payload,
                });
            } else if (status === STATUS_CODES.NOT_FOUND) {
                throw new HttpError({
                    status: STATUS_CODES.NOT_FOUND,
                    message: 'Resource not found',
                    payload: payload,
                });
            }
        }
        throw new Error('Unexpected error occurred during API request');
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