import { Elysia, t } from 'elysia';
import { jwtAccessToken } from '../../common/libs/jwt';
import { login } from './service';

export const authHandler = (app: Elysia) =>
  app.group('auth', (app) =>
    app.use(jwtAccessToken()).post(
      '/login',
      async ({ jwt, body, set }) => {
        const user = await login(body.email, body.password);

        const token = await jwt.sign({
          sub: user.id,
        });

        return {
          accessToken: token,
        };
      },
      {
        body: t.Object({
          email: t.String({
            format: 'email',
            examples: ['admin@admin.com'],
          }),
          password: t.String({
            minLength: 8,
            examples: ['password'],
          }),
        }),
        response: t.Object({
          accessToken: t.String(),
        }),
        detail: {
          description: 'Login to the application',
          tags: ['Auth'],
        },
      },
    ),
  );
