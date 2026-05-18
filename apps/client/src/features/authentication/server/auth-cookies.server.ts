import { setCookie, getCookie, deleteCookie, getRequest } from "@tanstack/react-start/server"
import { env } from '#/config/env'

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
}

export { setCookie, getCookie, deleteCookie, getRequest }
