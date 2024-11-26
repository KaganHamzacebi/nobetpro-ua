import { type Prisma } from '@prisma/client';

export interface ISection {
  id: string;
  name: string;
  color: string;
}

export type IDefaultSection = Prisma.DefaultSectionGetPayload<object>;
