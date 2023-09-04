import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import nookies, { setCookie } from 'nookies'
import jwt_decode from 'jwt-decode'

const settings = {
  withCredentials: true,
}

export const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  ...settings,
})

const onRequest = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  const cookies = nookies.get(null)
  const token = cookies.authToken
  if (token) {
    const decodedToken: { exp: number } = jwt_decode(token)
    const currentDate = new Date()

    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      const refresh = cookies.refreshToken
      if (refresh) {
        try {
          const response = await axios.post(
            'https://service.miceconnect.devcontour.ru/auth/refresh-tokens',
            {
              refreshToken: cookies.refreshToken,
            },
            { withCredentials: true },
          )

          response.data.access &&
            setCookie(null, 'authToken', response.data.access, {
              maxAge: 30 * 24 * 60 * 60,
              path: '/',
            })

          response.data.access &&
            setCookie(null, 'refreshToken', response.data.refresh, {
              maxAge: 30 * 24 * 60 * 60,
              path: '/',
            })
        } catch (e) {
          console.log('user not authorised')
        }
      }

      if (config?.headers) {
        const cookies = nookies.get(null)
        const newToken = cookies.authToken
        if (newToken) {
          config.headers.set('Authorization', `Bearer ${newToken}`)
        }
      }
    } else {
      const cookies = nookies.get(null)
      const token = cookies.authToken
      config.headers.set('Authorization', `Bearer ${token}`)
    }
  }
  return config
}

const onRequestError = async (error: AxiosError): Promise<AxiosError> => {
  return await Promise.reject(error)
}

instance.interceptors.request.use(onRequest, onRequestError)
