export type SuccessResponse<T = void> = T extends void
  ? {
      message: string;
    }
  : {
      message: string;
      data: T;
    };
