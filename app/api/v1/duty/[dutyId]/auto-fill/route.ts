import { getDutyById } from '@/libs/db/actions/duty-actions';
import { getDataOrThrow } from '@/libs/helpers/auth.helper';
import { NotFound } from '@/libs/helpers/response.helper';
import { UuidSchema } from '@/libs/helpers/schemas';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dutyId: string }> }
) {
  // check if authorized
  const { data: dutyId } = getDataOrThrow((await params).dutyId, UuidSchema);

  const duty = await getDutyById(dutyId);

  // if duty not exist return 404
  if (!duty) return NotFound();

  console.log(duty);

  return NextResponse.json(duty);
}
