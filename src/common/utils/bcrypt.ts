import bcrypt from 'bcrypt';
import { configuration } from 'src/common/config/configuration';

export const getHash = async (password: string): Promise<string> => {
  const saltRounds = configuration().bcrypt.saltRounds;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

export const compareHash = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const isHash = (password: string): boolean => {
  return bcrypt.getRounds(password) > 0;
};
