import {
  createMongoAbility,
  ForcedSubject,
  MongoAbility,
  RawRuleOf,
} from '@casl/ability';
import { eq, InferSelectModel } from 'drizzle-orm';
import { RoleToPermissionSchema } from '../../db/schemas/user/_role/role-to-permission.schema';
import { PermissionSchema } from '../../db/schemas/user/_role/_permission/permission.schema';
import { UserToRoleSchema } from '../../db/schemas/user/user-to-role.schema';
import { RoleSchema } from '../../db/schemas/user/_role/role.schema';
import { UserSchema } from '../../db/schemas/user/user.schema';
import { interpolate } from '../utils/string';
import { db } from '../../db';
import Cache from './cache';

export const permissionActions = [
  'manage',
  'create',
  'read',
  'update',
  'delete',
] as const;

export type PermissionActionType = (typeof permissionActions)[number];

export const permissionSubjects = ['User', 'Role', 'Permission'] as const;

export type PermissionSubjectType = (typeof permissionSubjects)[number];

export type Abilities = [
  (typeof permissionActions)[number],
  (
    | (typeof permissionSubjects)[number]
    | ForcedSubject<(typeof permissionSubjects)[number]>
  ),
];

export type AppAbility = MongoAbility<Abilities>;

type RoleToPermissionType = InferSelectModel<typeof RoleToPermissionSchema> & {
  permission: InferSelectModel<typeof PermissionSchema>;
};

type UserToRoleType = InferSelectModel<typeof UserToRoleSchema> & {
  role: InferSelectModel<typeof RoleSchema> & {
    roleToPermissions: RoleToPermissionType[];
  };
};

export type UserRolePermissionData = InferSelectModel<typeof UserSchema> & {
  userToRoles: UserToRoleType[];
};

const getUserPermissionRules = (
  user: UserRolePermissionData,
): RawRuleOf<AppAbility>[] => {
  const rules: RawRuleOf<AppAbility>[] = [];

  const sets = new Set<string>();

  user.userToRoles.forEach((userToRole) => {
    userToRole.role.roleToPermissions.forEach((roleToPermission) => {
      const action = roleToPermission.permission.action;
      const subject = roleToPermission.permission.subject;

      const setKey = `${action}:${subject}`;

      if (sets.has(setKey)) {
        return;
      }

      sets.add(setKey);

      let conditions: { [key: string]: any } | undefined = undefined;
      if (roleToPermission.conditions) {
        const currentUser: Partial<InferSelectModel<typeof UserSchema>> = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          status: user.status,
        };

        const jsonString = interpolate(
          roleToPermission.conditions,
          currentUser,
        );

        conditions = JSON.parse(jsonString);
      }
      rules.push({
        action: action as PermissionActionType,
        subject: subject as PermissionSubjectType,
        conditions: conditions ? conditions : undefined,
        fields: roleToPermission.fields?.split(',') ?? undefined,
      });
    });
  });
  return rules;
};

export const createAbility = (user?: UserRolePermissionData) => {
  let rules: RawRuleOf<AppAbility>[] = [];

  if (user && user.userToRoles?.length > 0) {
    rules = getUserPermissionRules(user);
  }

  return createMongoAbility<AppAbility>(rules);
};

export const getUserWithRolePermission = async (id: string) => {
  const cache = new Cache(`user:permission:${id}`);

  const cacheData = await cache.get();

  if (cacheData) {
    return cache;
  }

  const getUserData = await db.query.UserSchema.findFirst({
    columns: {
      id: true,
      name: true,
      email: true,
      emailVerifiedAt: true,
      image: true,
      status: true,
    },
    where: eq(UserSchema.id, id),
    with: {
      userToRoles: {
        with: {
          role: {
            with: {
              roleToPermissions: {
                with: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!getUserData) {
    return null;
  }

  await cache.set(getUserData, 60 * 5);

  return getUserData;
};

export const getAbility = async (userData: UserRolePermissionData) => {
  const ability = createAbility(userData);

  return ability;
};
