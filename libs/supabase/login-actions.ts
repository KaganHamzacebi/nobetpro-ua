'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { NotificationType } from '../enums/NotificationType';
import { createClient } from './server';

const successLoginNext = `/dashboard/duty-list?${NotificationType.LoginSuccess}=true`;

export const emailLogin = async (formData: { email: string; password: string }) => {
  const supabase = await createClient();
  const credentials = {
    email: formData.email,
    password: formData.password
  };

  const { error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    redirect(`/?${NotificationType.LoginFailed}=${error.message}`);
  }

  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard');
};

export async function emailSignup(formData: { email: string; password: string }) {
  const supabase = await createClient();
  const credentials = {
    email: formData.email,
    password: formData.password
  };

  const { error } = await supabase.auth.signUp(credentials);

  if (error) {
    redirect(`/?${NotificationType.SignupFailed}=${error.message}`);
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export const resetPassword = async (email: string) => {
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email);
  redirect('/paswordReset=true');
};

export const googleLogin = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?next=${successLoginNext}`
    }
  });

  if (!error) {
    return redirect(data.url);
  }
};

export const signOut = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (!error) {
    redirect('/');
  }
};
