import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { UserToRoleSchema } from '../user-to-role.schema';
import { RoleToPermissionSchema } from './role-to-permission.schema';

export const RoleSchema = pgTable(
  'Role',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAtt').defaultNow(),
  },
  (table) => {
    return {
      roleNameIdx: uniqueIndex('roleNameIdx').on(table.name),
    };
  },
);

export const RoleSchemaRelations = relations(RoleSchema, ({ many }) => ({
  userToRoles: many(UserToRoleSchema),
  roleToPermissions: many(RoleToPermissionSchema),
}));
