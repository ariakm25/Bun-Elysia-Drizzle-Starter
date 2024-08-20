import { Elysia, t } from 'elysia';
import { authPlugin } from '../../common/plugins/auth.plugin';
import { getAbilityByUserId } from '../../common/utils/permission';
import { subject } from '@casl/ability';
import { getUsers } from './service';
import { ForbiddenError } from '../../common/utils/error';

export const userHandler = (app: Elysia) =>
  app.group('users', (app) =>
    app.use(authPlugin).get(
      '/',
      async ({ query }) => {
        return await getUsers({
          pageSize: query.pageSize,
          page: query.page,
          name: query.name,
          email: query.email,
        });
      },
      {
        query: t.Object({
          name: t.Optional(t.String()),
          email: t.Optional(t.String()),
          page: t.Optional(t.Number()),
          pageSize: t.Optional(t.Number()),
        }),
        response: t.Object({
          items: t.Array(
            t.Object({
              id: t.String(),
              name: t.String(),
              email: t.String(),
              emailVerifiedAt: t.Nullable(t.Date()),
              image: t.Nullable(t.String()),
              status: t.Nullable(t.String()),
              createdAt: t.Nullable(t.Date()),
              updatedAt: t.Nullable(t.Date()),
            }),
          ),
          meta: t.Object({
            totalItem: t.Number(),
            currentPage: t.Number(),
            pageSize: t.Number(),
            totalPage: t.Number(),
          }),
        }),
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
