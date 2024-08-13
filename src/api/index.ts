import Elysia, { ValidationError } from 'elysia';
import { userHandler } from './users/handler';
import { authHandler } from './auth/handler';
import { ApiResponse } from '../common/types/api.type';
import { BadRequestError, UnauthorizedError } from '../common/utils/error';
import { ForbiddenError } from '@casl/ability';

export const api = new Elysia()
  .error({
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
  })
  .onError(({ code, error }) => {
    if (code === 'VALIDATION') {
      return {
        status: 400,
        message: 'ERROR',
        error: error.all,
      } as ApiResponse<typeof error.all>;
    }
  })
  .mapResponse(({ response, set, error }) => {
    let err = undefined;
    let msg = 'SUCCESS';
    if (error) {
      if (error instanceof ValidationError) {
        err = error.all;
        msg = 'VALIDATION_ERROR';
      } else if (error instanceof Error) {
        err = error.message;
        msg = 'ERROR';
      }
    }

    return {
      status: set.status,
      message: msg,
      data: response,
      error: err,
    } as ApiResponse<typeof response>;
  })
  .use(userHandler)
  .use(authHandler);
