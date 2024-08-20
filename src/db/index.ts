import { drizzle } from 'drizzle-orm/postgres-js';
import { pgConnection } from '../common/libs/postgres';
import * as RoleSchema from './schemas/user/_role/role.schema';
import * as PermissionSchema from './schemas/user/_role/_permission/permission.schema';
import * as RoleToPermissionSchema from './schemas/user/_role/role-to-permission.schema';
import * as UserSchema from './schemas/user/user.schema';
import * as UserToRoleSchema from './schemas/user/user-to-role.schema';

const db = drizzle(pgConnection, {
  schema: {
    ...RoleSchema,
    ...PermissionSchema,
    ...RoleToPermissionSchema,
    ...UserSchema,
    ...UserToRoleSchema,
  },
  logger: process.env.MODE === 'development',
});

export { db };
