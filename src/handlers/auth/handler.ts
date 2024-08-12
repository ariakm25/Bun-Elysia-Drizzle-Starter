import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { eq } from 'drizzle-orm';
import { UserSchema } from '../../db/schemas/user/user.schema';
import { hashPassword, verifyPassword } from '../../common/utils/hash';
import { jwtAccessToken } from '../../common/libs/jwt';

export const authHandler = (app: Elysia) =>
  app.group('auth', (app) =>
    app.use(jwtAccessToken()).post(
      '/login',
      async ({ jwt, body, set }) => {
        const user = await db.query.UserSchema.findFirst({
          where: eq(UserSchema.email, body.email),
        });

        if (!user) {
          set.status = 401;
          throw new Error('Invalid email or password');
        }

        if ((await verifyPassword(body.password, user.password)) === false) {
          set.status = 401;
          throw new Error('Invalid email or password');
        }

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
          }),
          password: t.String({
            minLength: 8,
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
