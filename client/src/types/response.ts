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


export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorType?: string,
  ) {
    super(message)
  }
}
