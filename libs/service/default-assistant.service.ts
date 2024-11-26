import { type Prisma } from '@prisma/client';
import { BASE_API_URL } from '../consts/api';

export const getDefaultAssistants = async () => {
  const response = await fetch(BASE_API_URL + `/default-assistants`);
  if (!response.ok) {
    throw new Error('Error fetching default assistants');
  }

  return response.json();
};

export const createDefaultAssistant = async (
  defaultAssistant: Omit<Prisma.DefaultAssistantCreateInput, 'User'>
) => {
  const response = await fetch(BASE_API_URL + `/default-assistants`, {
    method: 'POST',
    body: JSON.stringify(defaultAssistant)
  });

  if (!response.ok) {
    throw new Error('Error creating default assistants');
  }

  return response.json();
};

export const updateDefaultAssistant = async (
  data: Prisma.DefaultAssistantUpdateInput & { id: string }
) => {
  const response = await fetch(BASE_API_URL + `/default-assistants`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Error deleting default assistants');
  }

  return response.json();
};

export const deleteDefaultAssistants = async (assistantsIds: string[]) => {
  const response = await fetch(BASE_API_URL + `/default-assistants/bulk-delete`, {
    method: 'POST',
    body: JSON.stringify(assistantsIds)
  });

  if (!response.ok) {
    throw new Error('Error deleting default assistants');
  }

  return response.json();
};
