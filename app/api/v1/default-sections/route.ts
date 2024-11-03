import prisma from '@/libs/db/prisma';
import { createClient } from '@/libs/supabase/server';

interface IGETRequest {
  request: Request;
}

export async function GET({ request }: IGETRequest) {
  const supabase = createClient();
  const session = await supabase.auth.getUser();
  const userId = session.data.user?.id;

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const data = await prisma.defaultSection.findMany({
    where: { userId: userId }
  });

  return Response.json({ data });
}
