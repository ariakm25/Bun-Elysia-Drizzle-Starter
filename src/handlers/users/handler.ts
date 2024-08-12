import { Elysia } from 'elysia';
import { db } from '../../db';
import { authPlugin } from '../../common/plugins/auth.plugin';
import { getAbilityByUserId } from '../../common/utils/permission';
import { subject } from '@casl/ability';

export const userHandler = (app: Elysia) =>
  app.group('users', (app) =>
    app.use(authPlugin).get(
      '/',
      async () => {
        const users = await db.query.UserSchema.findMany({
          columns: {
            password: false,
          },
          limit: 25,
        });

        return users;
      },
      {
        beforeHandle: async ({ userId, set }) => {
          const ability = await getAbilityByUserId(userId);

          if (!ability) {
            set.status = 403;
            throw new Error(
              'You do not have permission to access this resource',
            );
          }

          const can = ability.can('read', subject('User', { id: 'all' }));

          if (!can) {
            set.status = 403;
            throw new Error(
              'You do not have permission to access this resource',
            );
          }
        },
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
  );
