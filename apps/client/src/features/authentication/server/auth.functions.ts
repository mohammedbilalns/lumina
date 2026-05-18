import { createServerFn } from '@tanstack/react-start'
import { registerApiSchema } from '../schemas/register.schema'
import { loginSchema } from '../schemas/login.schema'
import { authService } from '../services/auth.service'
import { withServerErrorHandler } from '#/utils/with-server-error-handler'
import { verifyOtpSchema, resendOtpSchema } from '../schemas/verify-otp.schema'
import { forgotPasswordSchema, resetPasswordApiSchema } from '../schemas/forgot-password.schema'

export const loginUser = createServerFn({ method: 'POST' })
  .inputValidator(loginSchema)
  .handler(withServerErrorHandler(async ({ data }) => {
    const { setCookie, AUTH_COOKIE_OPTIONS } = await import('./auth-cookies.server')
    const response = await authService.login(data)
    const { accessToken, refreshToken, user } = response.data
    setCookie('refreshToken', refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 7
    })

    return {
      message: response.message,
      data: { user, accessToken }
    }
  }))

export const registerUser = createServerFn({ method: 'POST' })
  .inputValidator(registerApiSchema)
  .handler(withServerErrorHandler(async ({ data }) => {
    return await authService.register(data)
  }))

export const verifySignupOtp = createServerFn({ method: 'POST' })
  .inputValidator(verifyOtpSchema)
  .handler(withServerErrorHandler(async ({ data }) => {
    const { setCookie, AUTH_COOKIE_OPTIONS } = await import('./auth-cookies.server')
    const response = await authService.verifySignupOtp(data)
    const { accessToken, refreshToken, user } = response.data
    setCookie('refreshToken', refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 7
    })

    return {
      message: response.message,
      data: { user, accessToken }
    }
  }))

export const resendSignupOtp = createServerFn({ method: 'POST' })
  .inputValidator(resendOtpSchema)
  .handler(withServerErrorHandler(async ({ data }) => {
    return await authService.resendSignupOtp(data)
  }))

export const getMe = createServerFn({ method: 'GET' })
  .handler(withServerErrorHandler(async () => {
    const { getCookie, setCookie, deleteCookie, AUTH_COOKIE_OPTIONS } = await import('./auth-cookies.server')
    const refreshToken = getCookie('refreshToken')
    
    if (!refreshToken) {
      return { data: { user: null, accessToken: null } }
    }

    try {
      const response = await authService.refreshToken(refreshToken)
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = response.data

      setCookie('refreshToken', newRefreshToken, {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24 * 7
      })

      return { data: { user, accessToken: newAccessToken } }
    } catch (err: any) {
      deleteCookie('refreshToken')
      return { data: { user: null, accessToken: null } }
    }
  }))

export const logoutUser = createServerFn({ method: 'POST' })
  .handler(withServerErrorHandler(async () => {
    const { getCookie, deleteCookie } = await import('./auth-cookies.server')
    const accessToken = getCookie('accessToken')
    if (accessToken) {
      try {
        await authService.logout(accessToken)
      } catch (err) {
      }
    }
    deleteCookie('accessToken')
    deleteCookie('refreshToken')
    return { message: 'Logged out' }
  }))

export const forgotPassword = createServerFn({ method: 'POST' })
  .inputValidator(forgotPasswordSchema)
  .handler(withServerErrorHandler(async ({ data }) => {
    return await authService.forgotPassword(data)
  }))

export const resendForgotPasswordOtp = createServerFn({ method: 'POST' })
  .inputValidator(forgotPasswordSchema)
  .handler(withServerErrorHandler(async ({ data }) => {
    return await authService.resendForgotPasswordOtp(data)
  }))

export const resetPassword = createServerFn({ method: 'POST' })
  .inputValidator(resetPasswordApiSchema)
  .handler(withServerErrorHandler(async ({ data }) => {
    return await authService.resetPassword(data)
  }))
