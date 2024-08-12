import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, eq, InferInsertModel } from 'drizzle-orm';
import { RoleSchema } from '../schemas/user/_role/role.schema';
import {
  permissionActions,
  permissionSubjects,
} from '../../common/utils/permission';
import { PermissionSchema } from '../schemas/user/_role/_permission/permission.schema';
import { RoleToPermissionSchema } from '../schemas/user/_role/role-to-permission.schema';
import { UserSchema } from '../schemas/user/user.schema';
import { UserToRoleSchema } from '../schemas/user/user-to-role.schema';
import { faker } from '@faker-js/faker';

export const userSeeder = async (database: PostgresJsDatabase) => {
  console.log('Seeding User...');
  await database.transaction(async (trx) => {
    //  Role Seed
    const adminRole = await trx
      .insert(RoleSchema)
      .values({
        name: 'Admin',
        description: 'Admin',
      })
      .onConflictDoNothing({ target: RoleSchema.name })
      .returning();

    const userRole = await trx
      .insert(RoleSchema)
      .values({
        name: 'User',
        description: 'User',
      })
      .onConflictDoNothing({ target: RoleSchema.name })
      .returning();

    const subjects = permissionSubjects;
    const actions = permissionActions;

    // Permission Seed
    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];

      for (let j = 0; j < actions.length; j++) {
        const action = actions[j];

        let createUserPermission;

        const checkUserPermission = await trx
          .select()
          .from(PermissionSchema)
          .where(
            and(
              eq(PermissionSchema.action, action),
              eq(PermissionSchema.subject, subject),
            ),
          );

        if (checkUserPermission.length) {
          continue;
        }

        createUserPermission = await trx
          .insert(PermissionSchema)
          .values({
            action: action,
            subject: subject,
            description: `Allow to ${action} ${subject}`,
          })
          .returning();

        if (createUserPermission) {
          if (createUserPermission[0]) {
            // Admin & User Permission Seed
            if (createUserPermission[0].action == 'manage') {
              if (adminRole[0]) {
                await trx
                  .insert(RoleToPermissionSchema)
                  .values({
                    roleId: adminRole[0].id,
                    permissionId: createUserPermission[0].id,
                  })
                  .onConflictDoNothing();
              }
            } else {
              // User Permission Seed
              if (
                createUserPermission[0].subject === 'User' &&
                (createUserPermission[0].action === 'read' ||
                  createUserPermission[0].action === 'update')
              ) {
                if (userRole[0]) {
                  await trx
                    .insert(RoleToPermissionSchema)
                    .values({
                      roleId: userRole[0].id,
                      permissionId: createUserPermission[0].id,
                      conditions: JSON.stringify({ id: '${id}' }),
                    })
                    .onConflictDoNothing();
                }
              }
            }
          }
        }
      }
    }

    // User Seed
    const admin = await trx
      .insert(UserSchema)
      .values({
        name: 'Admin',
        password:
          '$argon2id$v=19$m=65536,t=2,p=1$YGHiqTLEWXzNhNAdW4pT3Yl14cuWodeqnTgVtERPAJ4$+caqrKEBVK0apF9wq8zbnKAqQCa4xBxBVO0P3Mvd8OA', // password
        email: 'admin@admin.com',
        image: 'https://i.pravatar.cc/300',
        emailVerifiedAt: new Date(),
        status: 'active',
      })
      .onConflictDoNothing()
      .returning();

    const user = await trx
      .insert(UserSchema)
      .values({
        name: 'User',
        password:
          '$argon2id$v=19$m=65536,t=2,p=1$YGHiqTLEWXzNhNAdW4pT3Yl14cuWodeqnTgVtERPAJ4$+caqrKEBVK0apF9wq8zbnKAqQCa4xBxBVO0P3Mvd8OA', // password
        email: 'user@user.com',
        image: 'https://i.pravatar.cc/300',
        emailVerifiedAt: new Date(),
        status: 'pending',
      })
      .onConflictDoNothing()
      .returning();

    // User Role Seed
    if (adminRole[0]) {
      await trx
        .insert(UserToRoleSchema)
        .values({
          roleId: adminRole[0].id,
          userId: admin[0].id,
        })
        .onConflictDoNothing();
    }

    if (userRole[0]) {
      await trx
        .insert(UserToRoleSchema)
        .values({
          roleId: userRole[0].id,
          userId: user[0].id,
        })
        .onConflictDoNothing();
    }

    const getUserRole = await trx
      .select()
      .from(RoleSchema)
      .where(eq(RoleSchema.name, 'User'));

    for (let i = 0; i < 50; i++) {
      const randomUser = await trx
        .insert(UserSchema)
        .values({
          name: faker.person.fullName(),
          password:
            '$argon2id$v=19$m=65536,t=2,p=1$YGHiqTLEWXzNhNAdW4pT3Yl14cuWodeqnTgVtERPAJ4$+caqrKEBVK0apF9wq8zbnKAqQCa4xBxBVO0P3Mvd8OA', // password
          email: faker.internet.email(),
          image: faker.image.url(),
          emailVerifiedAt: new Date(),
          status: 'pending',
        })
        .onConflictDoNothing({
          target: UserSchema.email,
        })
        .returning();

      // User Role Seed
      if (getUserRole[0] && randomUser[0]) {
        await trx
          .insert(UserToRoleSchema)
          .values({
            roleId: getUserRole[0].id,
            userId: randomUser[0].id,
          })
          .onConflictDoNothing();
      }
    }
  });
};
