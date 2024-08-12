import { Elysia } from 'elysia';
import { db } from '../../db';
import { authPlugin } from '../../common/plugins/auth.plugin';
import { getAbilityByUserId } from '../../common/utils/permission';
import { subject } from '@casl/ability';

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
          beforeHandle: async ({ user, set }) => {
            const ability = await getAbilityByUserId(user);

            if (!ability) {
              set.status = 403;
              throw new Error('Permission denied');
            }

            const sub = subject('User', { id: 'all' });

            const can = ability.can('read', sub);

            if (!can) {
              set.status = 403;
              throw new Error('Permission denied');
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
    ),
  );
