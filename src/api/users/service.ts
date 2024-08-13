import { db } from '../../db';

export const getUsers = async ({ limit = 25 }: { limit?: number }) => {
  const users = await db.query.UserSchema.findMany({
    columns: {
      password: false,
    },
    limit: limit,
  });

  return users;
};
