import { eq } from 'drizzle-orm';
import { verifyPassword } from '../../common/utils/hash';
import { db } from '../../db';
import { UserSchema } from '../../db/schemas/user/user.schema';
import { UnauthorizedError } from '../../common/utils/error';

export const login = async (email: string, password: string) => {
  const user = await db.query.UserSchema.findFirst({
    where: eq(UserSchema.email, email),
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if ((await verifyPassword(password, user.password)) === false) {
    throw new UnauthorizedError('Invalid email or password');
  }

  return user;
};
