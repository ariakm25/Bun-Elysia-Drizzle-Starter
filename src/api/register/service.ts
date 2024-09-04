import { hashPassword } from '../../common/utils/hash';
import { db } from '../../db';
import { UserSchema } from '../../db/schemas/user/user.schema';
import { publicPath } from '../../index';

export const register = async (
  name: string,
  email: string,
  password: string,
  image: File | undefined,
) => {
  let publicFile = null;
  if (image != null) {
    publicFile = `/uploads/${image.name}`;
    const uploadPath = publicPath + publicPath;
    await Bun.write(uploadPath, await image.arrayBuffer());
  }

  return db.insert(UserSchema).values({
    name: name,
    email: email,
    password: await hashPassword(password),
    emailVerifiedAt: null,
    image: publicFile
  }).returning();
};
