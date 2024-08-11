import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { RoleToPermissionSchema } from '../role-to-permission.schema';

export const appPermissions = {};

export const PermissionSchema = pgTable('Permission', {
  id: serial('id').primaryKey(),
  subject: text('subject').notNull(),
  action: text('action').notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const PermissionSchemaRelations = relations(
  PermissionSchema,
  ({ many }) => ({
    roleToPermissions: many(RoleToPermissionSchema),
  }),
);
