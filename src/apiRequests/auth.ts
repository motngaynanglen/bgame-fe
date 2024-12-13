import http from '@/src/lib/httpAxios'
import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterPartnerBodyType,
  RegisterResType,
  SlideSessionResType
} from '@/src/schemaValidations/auth.schema'
import { MessageResType } from '@/src/schemaValidations/common.schema'

const authApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>('/api/Auth/login', body),
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>('/api/Auth/register', body),
  registerPartner: (body: RegisterPartnerBodyType) =>
    http.post<RegisterResType>('/api/Auth/register-partner', body),
  auth: (body: { sessionToken: string; sessionRole: string ; expiresAt: string }) =>
    http.post('/api/auth', body, {
      baseUrl: ''
    }),
  logoutFromNextServerToServer: (sessionToken: string) => //Không dùng vì be ko có đăng xuất
    http.post<MessageResType>(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`
        }
      }
    ),
  logoutFromNextClientToNextServer: (
    force?: boolean | undefined,
    signal?: AbortSignal | undefined
  ) =>
    http.post<MessageResType>(
      '/api/auth/logout',
      {
        force
      },
      {
        baseUrl: '',
        signal
      }
    ),
  slideSessionFromNextServerToServer: (sessionToken: string) => //Không dùng vì be ko có chức năng kéo dài jwt
    http.post<SlideSessionResType>(
      '/auth/slide-session',
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`
        }
      }
    ),
  slideSessionFromNextClientToNextServer: () => //Không dùng vì be ko có chức năng kéo dài jwt
    http.post<SlideSessionResType>(
      '/api/auth/slide-session',
      {},
      { baseUrl: '' }
    )
}

export default authApiRequest