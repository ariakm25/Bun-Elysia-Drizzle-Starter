import { integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { RoleSchema } from './role.schema';
import { PermissionSchema } from './_permission/permission.schema';

export const RoleToPermissionSchema = pgTable(
  'RoleToPermission',
  {
    roleId: integer('roleId')
      .notNull()
      .references(() => RoleSchema.id, {
        onDelete: 'cascade',
      }),
    permissionId: integer('permissionId')
      .notNull()
      .references(() => PermissionSchema.id, {
        onDelete: 'cascade',
      }),
    conditions: text('conditions'),
    fields: text('fields'),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.permissionId, t.roleId],
    }),
  }),
);

export const RoleToPermissionSchemaRelations = relations(
  RoleToPermissionSchema,
  ({ one }) => ({
    role: one(RoleSchema, {
      fields: [RoleToPermissionSchema.roleId],
      references: [RoleSchema.id],
    }),
    permission: one(PermissionSchema, {
      fields: [RoleToPermissionSchema.permissionId],
      references: [PermissionSchema.id],
    }),
  }),
);
