import { Elysia } from 'elysia';
import { db } from '../../db';

export const userHandler = (app: Elysia) =>
  app.group('users', (app) =>
    app.get(
      '/',
      async (ctx) => {
        const users = await db.query.UserSchema.findMany({
          limit: 25,
        });

        return users;
      },
      {
        detail: {
          description: 'Get a list of user data',
          tags: ['User'],
        },
      },
    ),
  );
