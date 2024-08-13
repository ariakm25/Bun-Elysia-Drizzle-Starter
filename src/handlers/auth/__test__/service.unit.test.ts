import { describe, expect, it } from 'bun:test';
import { login } from '../service';

describe('AuthService::Login', () => {
  it('should return a user', async () => {
    const userLogin = await login('admin@admin.com', 'password');

    expect(userLogin).toBeDefined();
    expect(userLogin.email).toBe('admin@admin.com');
  });

  it('should throw an error if the email is invalid', async () => {
    try {
      await login('notfound@example.com', 'password');
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      if (e instanceof Error) {
        expect(e.message).toBe('Invalid email or password');
      }
    }
  });

  it('should throw an error if the password is invalid', async () => {
    try {
      await login('admin@admin.com', 'invalidpassword');
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      if (e instanceof Error) {
        expect(e.message).toBe('Invalid email or password');
      }
    }
  });
});
