import type { User } from "@/types/user"

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
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
