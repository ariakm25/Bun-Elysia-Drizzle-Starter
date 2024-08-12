import bearer from '@elysiajs/bearer';
import jwt from '@elysiajs/jwt';
import Elysia from 'elysia';
import { jwtAccessToken } from '../libs/jwt';

export const authPlugin = (app: Elysia) => {
  return app
    .use(bearer())
    .use(jwtAccessToken())
    .derive(async ({ jwt, set, bearer }) => {
      if (!bearer) {
        set.status = 401;
        set.headers['WWW-Authenticate'] =
          `Bearer realm='sign', error="invalid_request"`;

        throw new Error('invalid access token');
      }

      const jwtPayload = await jwt.verify(bearer);

      if (!jwtPayload) {
        set.status = 401;

        throw new Error('invalid access token');
      }

      const id = jwtPayload.sub;

      if (!id) {
        set.status = 401;

        throw new Error('invalid access token');
      }

      return {
        userId: id,
      };
    });
};
