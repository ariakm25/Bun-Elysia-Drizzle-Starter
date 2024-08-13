import { describe, expect, it } from 'bun:test';
import { getUsers } from '../service';

describe('UserService::GetUsers', () => {
  it('should return users', async () => {
    const users = await getUsers({
      limit: 10,
    });

    expect(users).toBeDefined();
    expect(users.length).toBe(10);
  });
});
