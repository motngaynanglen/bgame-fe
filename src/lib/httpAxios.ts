import envConfig from '@/src/config'
import { normalizePath } from '@/src/lib/utils'
import { LoginResType } from '@/src/schemaValidations/auth.schema'
import axios, { AxiosError } from 'axios'
import { redirect } from 'next/navigation'
import { number } from 'zod'

type CustomOptions = Omit<RequestInit, 'method'> & {
    baseUrl?: string | undefined
}

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;
const NOT_FOUND_STATUS = 400;
const AUTHENTICATION_FAIL_STATUS = 404;
const SERVER_ERROR_STATUS = 500;
const OK_STATUS = 200;
type EntityErrorPayload = {
    message: string
    errors: EntityErrorField[]
}
type EntityErrorField = {
    field: string
    message: string
}
export class HttpError extends Error {
    status: number
    payload: {
        message: string
        [key: string]: any
    }
    constructor({ status, payload }: { status: number; payload: any }) {
        super('Http Error')
        this.status = status
        this.payload = payload
    }
}

export class EntityError extends HttpError {
    status: 422
    payload: EntityErrorPayload
    constructor({
        status,
        payload
    }: {
        status: 422
        payload: EntityErrorPayload
    }) {
        super({ status, payload })
        this.status = status
        this.payload = payload
    }
}

let clientLogoutRequest: null | Promise<any> = null
export const isClient = () => typeof window !== 'undefined'

const request = async <Response>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    options?: CustomOptions | undefined
) => {
    let body: FormData | string | undefined = undefined
    if (options?.body instanceof FormData) {
        body = options.body
    } else if (options?.body) {
        body = JSON.stringify(options.body)
    }
    const baseHeaders: {
        [key: string]: string
    } =
        body instanceof FormData
            ? {}
            : {
                'Content-Type': 'application/json'
            }

    if (isClient()) {
        //yên tâm ko có thằng nào set session token trên local storage đâu. (code này chưa được dùng)
        const sessionToken = localStorage.getItem('sessionToken')
        if (sessionToken) {
            baseHeaders.Authorization = `Bearer ${sessionToken}`
        }
    }
    // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
    // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server

    const baseUrl =
        options?.baseUrl === undefined
            ? envConfig.NEXT_PUBLIC_API_ENDPOINT
            : options.baseUrl

    const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`

    const axiosConfig = {
        method,
        url: fullUrl,
        headers: {
            ...baseHeaders,
            ...options?.headers,
        },
        data: body,
        // validateStatus: function(status){
        //     return status < 500;
        // }
    };

    try {
        console.log(axiosConfig)
        const response = await axios(axiosConfig);
        const payload: Response = await response.data.payload ?? response.data;
        const strstatus: string = response.data.status as string;
        const status: number = Number(strstatus.slice(0, 3));
        const data = {
            status: status,
            payload
        };
        //code này chạy nếu axios không nhảy try catch
        if (!(status === OK_STATUS)) {
            if (status === ENTITY_ERROR_STATUS) {
                throw new EntityError(
                    data as {
                        status: 422
                        payload: EntityErrorPayload
                    }
                )

            } else if (status === NOT_FOUND_STATUS) {
                throw new HttpError(
                    data as {
                        status: 400
                        payload: "Lỗi 400"
                    }
                )
            } else if (status === AUTHENTICATION_ERROR_STATUS) {
                if (isClient()) {
                    if (!clientLogoutRequest) {
                        clientLogoutRequest = fetch('/api/auth/logout', {
                            method: 'POST',
                            body: JSON.stringify({ force: true }),
                            headers: {
                                ...baseHeaders
                            } as any
                        })
                        try {
                            await clientLogoutRequest;
                        } catch (error) {
                        } finally {
                            localStorage.removeItem('sessionToken');
                            localStorage.removeItem('sessionTokenExpiresAt');
                            clientLogoutRequest = null;
                            location.href = '/login';
                        }
                    }
                } else {
                    const sessionToken = (options?.headers as any)?.Authorization.split(
                        'Bearer '
                    )[1]
                    redirect(`/logout?sessionToken=${sessionToken}`)
                }
            } else if (status == AUTHENTICATION_FAIL_STATUS) {
                throw new HttpError(
                    data as {
                        status: 404
                        payload: "ko ổn r"
                    }
                )
            } else {
                throw new HttpError(data)
            }
        }
        // if (isClient()) {
        //     if (['auth/login', 'auth/register'].some((item) => item === normalizePath(url))) {
        //         const { token, expiresAt } = (payload as LoginResType).data
        //         localStorage.setItem('sessionToken', token)
        //         // localStorage.setItem('sessionTokenExpiresAt', expiresAt)
        //     } else if ('auth/logout' === normalizePath(url)) {
        //         localStorage.removeItem('sessionToken')
        //         // localStorage.removeItem('sessionTokenExpiresAt')
        //     }
        // }

        return data;
    } catch (error: any) {
        //bởi vì axios sẽ nhảy trycatch nếu bị lỗi nên phải hander ở trong này.
        const payload: Response = error.response?.data.errors;
        const status: number = error.response?.data.status;
        const data = {
            status: status,
            payload
        };
        if (error instanceof AxiosError) {
            console.log("Axios API Error: ");
            if(error.response?.status === 404){
                console.log("API không tồn tại hoặc bị xóa");
            }
            if (!(status === OK_STATUS)) {
                if (status === ENTITY_ERROR_STATUS) {
                    throw new EntityError(
                        data as {
                            status: 422
                            payload: EntityErrorPayload
                        }
                    )

                } else if (status === AUTHENTICATION_ERROR_STATUS) {
                    if (isClient()) {
                        if (!clientLogoutRequest) {
                            clientLogoutRequest = fetch('/api/auth/logout', {
                                method: 'POST',
                                body: JSON.stringify({ force: true }),
                                headers: {
                                    ...baseHeaders
                                } as any
                            })
                            try {
                                await clientLogoutRequest;
                            } catch (error) {
                            } finally {
                                localStorage.removeItem('sessionToken');
                                // localStorage.removeItem('sessionTokenExpiresAt');
                                clientLogoutRequest = null;
                                location.href = '/login';
                            }
                        }
                    } else {
                        const sessionToken = (options?.headers as any)?.Authorization.split(
                            'Bearer '
                        )[1]
                        redirect(`/logout?sessionToken=${sessionToken}`)
                    }
                } else if (status === SERVER_ERROR_STATUS) {
                    throw new HttpError(
                        data as {
                            status: 500
                            payload: "Máy chủ hiện đang có vấn đề."
                        }
                    )
                } else if (status === AUTHENTICATION_FAIL_STATUS) {
                    
                    throw new HttpError(
                        data as {
                            status: 404
                            payload: "Không tìm thấy tài khoảng hoặc mật khẩu!"
                        }
                    )
                } else if (status === NOT_FOUND_STATUS) {
                    
                    throw new HttpError(
                        {
                            status: 400,
                            payload: payload
                        }
                    )
                } else {
                    throw new HttpError(data)
                }
            }

            // if (isClient()) {
            //     if (['auth/login', 'auth/register'].some((item) => item === normalizePath(url))) {
            //         // const { token, expiresAt } = (payload as LoginResType).data
            //         const { token } = (payload as LoginResType).data
            //         localStorage.setItem('sessionToken', token)
            //         // localStorage.setItem('sessionTokenExpiresAt', expiresAt)
            //     } else if ('auth/logout' === normalizePath(url)) {
            //         localStorage.removeItem('sessionToken')
            //         // localStorage.removeItem('sessionTokenExpiresAt')
            //     }
            // }

        }
        return data;
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