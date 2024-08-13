import bearer from '@elysiajs/bearer';
import Elysia from 'elysia';
import { jwtAccessToken } from '../libs/jwt';
import { UnauthorizedError } from '../utils/error';

export const authPlugin = (app: Elysia) => {
  return app
    .use(bearer())
    .use(jwtAccessToken())
    .derive(async ({ jwt, set, bearer }) => {
      if (!bearer) {
        set.status = 401;
        set.headers['WWW-Authenticate'] =
          `Bearer realm='sign', error="invalid_request"`;

        throw new UnauthorizedError('invalid access token');
      }

      const jwtPayload = await jwt.verify(bearer);

      if (!jwtPayload) {
        set.status = 401;

        throw new UnauthorizedError('invalid access token');
      }

      const id = jwtPayload.sub;

      if (!id) {
        set.status = 401;

        throw new UnauthorizedError('invalid access token');
      }

      return {
        userId: id,
      };
    });
};
