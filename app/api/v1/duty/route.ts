import { auth } from '@/libs/auth/auth';
import prisma from '@/libs/db/prisma';
import { getSessionOrThrow } from '@/libs/helpers/auth.helper';
import { BadRequest, Created, ServerError } from '@/libs/helpers/response.helper';
import { DutySchema } from '@/libs/models/duty-model';
import { unauthorized } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

// Create Duty
export async function POST(request: NextRequest) {
  const { userId } = await getSessionOrThrow();

  const body = await request.json();
  const { success, error, data } = DutySchema.safeParse(body);
  if (!success) return BadRequest(error);

  try {
    const response = await prisma.duty.create({
      data: {
        user: {
          connect: {
            id: userId
          }
        },
        restDayCount: data.restDayCount,
        dutyMonth: data.dutyMonth,
        pinned: data.pinned,
        description: data?.description,
        assistantList: {
          create: data.assistantList
        },
        sectionList: {
          create: data.sectionList
        },
        assistantSectionConfig: {
          create: data.assistantSectionConfig
        },
        selectedDays: {
          create: data.selectedDays
        },
        unwantedDays: {
          create: data.unwantedDays
        }
      },
      include: {
        assistantSectionConfig: {
          include: {
            section: true
          }
        },
        assistantList: true,
        sectionList: true,
        selectedDays: {
          include: {
            section: true
          }
        },
        unwantedDays: true
      }
    });

    return Created(response);
  } catch (error) {
    return ServerError(error);
  }
}

// Get All Duties
export async function GET() {
  const session = await auth();
  if (!session) unauthorized();
  const userId = session.user?.id as string;

  const duties = await prisma.duty.findMany({
    where: {
      userId
    },
    include: {
      assistantSectionConfig: {
        include: {
          section: true
        }
      },
      assistantList: true,
      sectionList: true,
      selectedDays: {
        include: {
          section: true
        }
      },
      unwantedDays: true
    },
    orderBy: [
      {
        pinned: 'desc'
      },
      {
        updatedAt: 'asc'
      }
    ]
  });

  return NextResponse.json(duties);
}
