import bcrypt from 'bcryptjs';

export const GenerateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (getRandomNumberGenerator() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const getRandomNumberGenerator = () => {
  if (typeof window !== 'undefined') {
    const crypto = window.crypto || window.Crypto;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const value = array[0];
    let multiplier = '1';
    let counter = value.toString().length;
    while (counter > 0) {
      multiplier += '0';
      counter -= 1;
    }

    return value / Number(multiplier);
  }
  return 0;
};

export const GenerateHash = async (value: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(value, salt);
};
