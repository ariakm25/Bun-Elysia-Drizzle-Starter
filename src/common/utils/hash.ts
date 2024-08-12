export const hashPassword = async (password: string) => {
  return await Bun.password.hash(password);
};

export const verifyPassword = async (password: string, hash: string) => {
  return await Bun.password.verify(password, hash);
};
