'server-only';

import { IDefaultSection } from '@/libs/models/duty-model';

import { type Prisma } from '@prisma/client';
import { BASE_API_URL } from '../consts/api';

export const getDefaultSections = async (): Promise<IDefaultSection[]> => {
  const response = await fetch(BASE_API_URL + `/default-sections`);
  if (!response.ok) {
    throw new Error('Error fetching default sections');
  }

  return response.json();
};

export const createDefaultSection = async (defaultSection: IDefaultSection) => {
  const response = await fetch(BASE_API_URL + `/default-sections`, {
    method: 'POST',
    body: JSON.stringify(defaultSection)
  });

  if (!response.ok) {
    throw new Error('Error creating default sections');
  }

  return response.json();
};

export const updateDefaultSection = async (
  data: Prisma.DefaultSectionUpdateInput & { id: string }
) => {
  const response = await fetch(BASE_API_URL + `/default-sections`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Error deleting default sections');
  }

  return response.json();
};

export const deleteDefaultSections = async (sectionIds: string[]) => {
  const response = await fetch(BASE_API_URL + `/default-sections/bulk-delete`, {
    method: 'POST',
    body: JSON.stringify(sectionIds)
  });

  if (!response.ok) {
    throw new Error('Error deleting default sections');
  }

  return response.json();
};
