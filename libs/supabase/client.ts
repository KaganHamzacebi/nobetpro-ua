import { createBrowserClient } from '@supabase/ssr';

export const getUser = async () => {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  return user;
};

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) throw new Error('SUPABASE URL or AnonKey is missing');

  return createBrowserClient(url, anonKey);
};
