export interface ErrorResponse {
  message: string
  error: string
  statusCode: number
}

export type SuccessResponse<T = void> = T extends void
  ? {
      message: string
    }
  : {
      message: string
      data: T
    }
