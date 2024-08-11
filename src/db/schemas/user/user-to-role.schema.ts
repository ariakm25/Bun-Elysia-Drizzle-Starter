import { integer, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { UserSchema } from './user.schema';
import { RoleSchema } from './_role/role.schema';

export const UserToRoleSchema = pgTable(
  'UserToRole',
  {
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => UserSchema.id, {
        onDelete: 'cascade',
      }),
    roleId: integer('roleId')
      .notNull()
      .references(() => RoleSchema.id, {
        onDelete: 'cascade',
      }),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.userId, t.roleId],
    }),
  }),
);

export const UserToRoleSchemaRelations = relations(
  UserToRoleSchema,
  ({ one }) => ({
    user: one(UserSchema, {
      fields: [UserToRoleSchema.userId],
      references: [UserSchema.id],
    }),
    role: one(RoleSchema, {
      fields: [UserToRoleSchema.roleId],
      references: [RoleSchema.id],
    }),
  }),
);
