import { Elysia } from 'elysia';
import { authPlugin } from '../../common/plugins/auth.plugin';
import { getAbilityByUserId } from '../../common/utils/permission';
import { subject } from '@casl/ability';
import { getUsers } from './service';
import { ForbiddenError } from '../../common/utils/error';

export const userHandler = (app: Elysia) =>
  app.group('users', (app) =>
    app.use(authPlugin).get(
      '/',
      async () => {
        return getUsers({ limit: 50 });
      },
      {
        beforeHandle: async ({ userId }) => {
          const ability = await getAbilityByUserId(userId);

          if (!ability) {
            throw new ForbiddenError(
              'You do not have permission to access this resource',
            );
          }

          const can = ability.can('read', subject('User', { id: 'all' }));

          if (!can) {
            throw new ForbiddenError(
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
