import { v7 as uuid } from 'uuid';
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { UserToRoleSchema } from './user-to-role.schema';

export const UserStatusEnum = pgEnum('userStatusEnum', [
  'pending',
  'active',
  'inactive',
  'suspended',
]);

export const UserSchema = pgTable(
  'User',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .unique()
      .$defaultFn(() => uuid()),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerifiedAt: timestamp('emailVerifiedAt'),
    password: text('password').notNull(),
    image: text('image'),
    status: UserStatusEnum('status').default('pending'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
  },
  (table) => {
    return {
      userEmailIdx: uniqueIndex('userEmailIdx').on(table.email),
    };
  },
);

export const UserSchemaRelations = relations(UserSchema, ({ one, many }) => ({
  userToRoles: many(UserToRoleSchema),
}));
