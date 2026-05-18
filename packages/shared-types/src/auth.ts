import type { UserProfile } from './user.js'

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: UserProfile
}

export interface OtpResponse {
  email: string
  attemptsRemaining: number
}

export interface VerifyOtpPayload {
  email: string
  otp: string
}

export interface ResendOtpPayload {
  email: string
}
