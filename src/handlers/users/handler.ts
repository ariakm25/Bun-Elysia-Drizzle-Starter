import { Elysia } from 'elysia';
import { db } from '../../db';
import { authPlugin } from '../../common/plugins/auth.plugin';

export const userHandler = (app: Elysia) =>
  app.group('users', (app) =>
    app.guard((app) =>
      app.use(authPlugin).get(
        '/',
        async () => {
          const users = await db.query.UserSchema.findMany({
            limit: 25,
          });

          return users;
        },
        {
          detail: {
            description: 'Get a list of user data',
            tags: ['User'],
            security: [
              {
                JwtAuth: [],
              },
            ],
          },
        },
      ),
    ),
  );
