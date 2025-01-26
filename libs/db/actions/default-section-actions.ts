'use server';

import { BASE_API_URL } from '@/libs/consts/api';
import { IDefaultSection } from '@/libs/models/duty-model';
import { cookies } from 'next/headers';

export const getDefaultSections = async (): Promise<IDefaultSection[]> => {
  const c = await cookies();

  const res = await fetch(BASE_API_URL + '/default-sections', {
    method: 'GET',
    headers: { Cookie: c.toString() }
  });

  return (await res.json()).body;
};
