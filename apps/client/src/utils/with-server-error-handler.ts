import { ApiError } from '@/types/response'

export function withServerErrorHandler<TInput, TResult>(
  handler: (input: TInput) => Promise<TResult>,
) {
  return async (input: TInput): Promise<TResult> => {
    try {
      return await handler(input)
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof Error) {
        throw new ApiError(
          error.message,
          500,
          'InternalServerError',
        )
      }

      throw new ApiError(
        'Something went wrong',
        500,
        'UnknownError',
      )
    }
  }
}
