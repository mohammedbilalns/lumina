export type { ErrorResponse, SuccessResponse } from './api'


export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorType?: string,
  ) {
    super(message)
  }
}
