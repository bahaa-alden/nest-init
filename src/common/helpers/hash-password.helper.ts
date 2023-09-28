import * as argon from 'argon2';

export const generateHash = async (password: string) =>
  await argon.hash(password);

export const verifyHash = async (hash: string, password: string) =>
  await argon.verify(hash, password);
