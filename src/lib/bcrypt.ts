import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';

export const hash = async (text: string, saltRounds = 10) => {
  if (!text) throw Error('Empty string');

  return await bcryptHash(text, saltRounds);
};

export const compare = async (text: string, hashedText: string) => bcryptCompare(text, hashedText);
