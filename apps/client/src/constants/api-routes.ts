import { env } from '@/config/env'

export const API_ROUTES = {
  auth: {
    login: `${env.API_URL}/auth/login`,
    register: `${env.API_URL}/auth/signup`,
    verifySignupOtp: `${env.API_URL}/auth/signup/verify-otp`,
    refreshToken: `${env.API_URL}/auth/refresh-token`,
    logout: `${env.API_URL}/auth/logout`,
    resendSignupOtp: `${env.API_URL}/auth/signup/resend-otp`,
    forgotPassword: `${env.API_URL}/auth/forgot-password`,
    resendForgotPasswordOtp: `${env.API_URL}/auth/forgot-password/resend-otp`,
    resetPassword: `${env.API_URL}/auth/reset-password`,
  },
  categories: `${env.API_URL}/categories`,
  preferences: {
    root: `${env.API_URL}/preferences`,
    status: `${env.API_URL}/preferences/status`,
  },
  users: {
    profile: `${env.API_URL}/users/profile`,
    changePassword: `${env.API_URL}/users/change-password`,
  },
  articles: {
    root: `${env.API_URL}/articles`,
    preferred: (page = 1, limit = 10, search?: string) => `${env.API_URL}/articles/preferences?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`,
    public: (page = 1, limit = 10, search?: string) => `${env.API_URL}/articles/public?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`,
    own: (page = 1, limit = 10) => `${env.API_URL}/articles/me?page=${page}&limit=${limit}`,
    byId: (articleId: string) => `${env.API_URL}/articles/${articleId}`,
  },
  reactions: {
    react: `${env.API_URL}/reactions/articles/react`,
    block: `${env.API_URL}/reactions/articles/block`,
  },
  uploads: {
    presignedUrl: `${env.API_URL}/uploads/presigned-url`,
  },
} as const
