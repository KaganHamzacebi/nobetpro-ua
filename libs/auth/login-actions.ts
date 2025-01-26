'use server';

import { signIn, signOut } from './auth';

const googleLogin = async () => {
  await signIn('google');
};

const logout = async () => {
  await signOut();
};

export { googleLogin, logout };
