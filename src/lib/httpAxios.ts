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
    PERMISSION_DENIED: 403,
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
type EntityErrorShape = string | string[] | Record<string, string[]>

export type EntityErrordata = {
    errors: EntityErrorShape
}
export class EntityError extends HttpError {
    status: 422 | 400
    message: string
    data: EntityErrordata
    constructor({ status, message, data }: {
        status: 422; message: string; data: EntityErrordata
    }) {
        super({
            status,
            message,
            data: {
                errors: EntityError.normalizeErrors(data.errors)
            }
        })

        this.status = status
        this.message = message
        this.data = {
            errors: EntityError.normalizeErrors(data.errors)
        }
    }
    static normalizeErrors(errors: EntityErrorShape): EntityErrorShape {
        if (typeof errors === "string") {
            return [errors]
        }

        if (Array.isArray(errors)) {
            return errors
        }

        if (typeof errors === "object" && errors !== null) {
            const normalized: Record<string, string[]> = {}
            for (const key in errors) {
                const val = errors[key]
                normalized[key] = Array.isArray(val)
                    ? val.map(v => String(v))
                    : [String(val)]
            }
            return normalized
        }

        // fallback
        return ["Unknown error"]
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
        console.log(error);
        //bởi vì axios sẽ nhảy trycatch nếu bị lỗi nên phải hander ở trong này.
        if (error instanceof AxiosError && error.response) {
            const { status, data } = error.response;

            if (status === STATUS_CODES.ENTITY_ERROR) {
                throw new EntityError({
                    status: STATUS_CODES.ENTITY_ERROR,
                    message: data.message || 'Validation error',
                    data: {
                        errors: EntityError.normalizeErrors(data.data)
                    }, // Chuyển đổi data về kiểu EntityErrordata
                    // data: data as EntityErrordata,
                });
            } else if (status === STATUS_CODES.SERVER_ERROR) {
                throw new HttpError({
                    status: STATUS_CODES.SERVER_ERROR,
                    message: 'Ôi không! Máy chủ đang cập nhật hoặc gặp sự cố. Vui lòng thử lại sau.',
                    data: data.data,
                });
            } else if (status === STATUS_CODES.AUTHENTICATION_ERROR) {
                // setUser(null); // Xóa thông tin người dùng khỏi localStorage

                // if (typeof window !== 'undefined') {
                //     window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập
                //   }
                throw new HttpError({
                    status: STATUS_CODES.AUTHENTICATION_ERROR,
                    message: 'Bạn cần đăng nhập để thực hiện thao tác này',
                    data: data.data,
                });
            }else if (status === STATUS_CODES.PERMISSION_DENIED) {
                throw new HttpError({
                    status: STATUS_CODES.PERMISSION_DENIED,
                    message: 'Bạn không có quyền truy cập vào tài nguyên này',
                    data: data.data,
                });
            } else if (status === STATUS_CODES.NOT_FOUND) {
                throw new HttpError({
                    status: STATUS_CODES.NOT_FOUND,
                    message: 'Không tìm thấy tài nguyên',
                    data: data,
                });
            } else if (status === STATUS_CODES.ENTITY_ERROR) {
                throw new HttpError({
                    status: STATUS_CODES.ENTITY_ERROR,
                    message: 'Lỗi logic khi tạo dữ liệu',
                    data: data.data,
                });
            } else if (status === STATUS_CODES.BAD_REQUEST) {
                throw new HttpError({
                    status: STATUS_CODES.BAD_REQUEST,
                    message: 'Lỗi logic khi tạo dữ liệu',
                    data: data.data,
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