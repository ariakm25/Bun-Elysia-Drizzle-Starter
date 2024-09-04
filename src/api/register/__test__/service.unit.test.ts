import { describe, expect, it } from 'bun:test';
import { register } from '../service';
import { db } from '../../../db';
import { UserSchema } from '../../../db/schemas/user/user.schema';
import { eq } from 'drizzle-orm';

describe('RegisterService::Register', () => {
  it('should return a user after register', async () => {
    const userLogin = await register(
      "ajis",
      "azis.naufal@gmail.com",
      "78789899",
      undefined
    );

    expect(userLogin).toBeDefined();
    expect(userLogin[0].name).toBe('ajis');
    expect(userLogin[0].email).toBe('azis.naufal@gmail.com');

    db.delete(UserSchema).where(
      eq(UserSchema.email, "azis.naufal@gmail.com")
    );
  });

});
