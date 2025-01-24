'use server';

import { BASE_API_URL } from '@/libs/consts/api';
import { getDefaultAssistants } from '@/libs/db/actions/default-assistant-actions';
import { getDefaultSections } from '@/libs/db/actions/default-section-actions';
import { NewDuty } from '@/libs/helpers/model-generator';
import {
  IAssistantSectionConfig,
  IDuty,
  IDutyAssistant,
  IDutySection,
  ISelectedDay
} from '@/libs/models/duty-model';
import { cookies } from 'next/headers';

export const createNewDuty = async (): Promise<IDuty> => {
  const defaultAssistantsData = await getDefaultAssistants();
  const defaultSectionsData = await getDefaultSections();

  const duty = NewDuty(defaultAssistantsData, defaultSectionsData);
  return await createDuty(duty);
};

export const createDuty = async (duty: IDuty): Promise<IDuty> => {
  const c = await cookies();

  const res = await fetch(BASE_API_URL + '/duty', {
    method: 'POST',
    headers: { Cookie: c.toString() },
    body: JSON.stringify(duty)
  });

  return (await res.json()).body;
};

export const pinDuty = async (dutyId: IDuty['id'], pinned: IDuty['pinned']) => {
  const c = await cookies();

  await fetch(BASE_API_URL + '/duty/' + dutyId, {
    method: 'PATCH',
    headers: { Cookie: c.toString() },
    body: JSON.stringify({ pinned })
  });
};

export const selectDay = async (dutyId: IDuty['id'], selectedDay: ISelectedDay) => {
  const c = await cookies();

  await fetch(BASE_API_URL + `/duty/${dutyId}/select-day`, {
    method: 'POST',
    headers: { Cookie: c.toString() },
    body: JSON.stringify(selectedDay)
  });
};

export const unselectDay = async (
  dutyId: IDuty['id'],
  data: Pick<ISelectedDay, 'assistantId' | 'dayIndex'>
) => {
  const c = await cookies();

  await fetch(BASE_API_URL + `/duty/${dutyId}/unselect-day`, {
    method: 'POST',
    headers: { Cookie: c.toString() },
    body: JSON.stringify(data)
  });
};

export const selectUnwantedDay = async (
  dutyId: IDuty['id'],
  data: Pick<ISelectedDay, 'assistantId' | 'dayIndex'>
) => {
  const c = await cookies();

  await fetch(BASE_API_URL + `/duty/${dutyId}/select-unwanted-day`, {
    method: 'POST',
    headers: { Cookie: c.toString() },
    body: JSON.stringify(data)
  });
};

export const unselectUnwantedDay = async (
  dutyId: IDuty['id'],
  data: Pick<ISelectedDay, 'assistantId' | 'dayIndex'>
) => {
  const c = await cookies();

  await fetch(BASE_API_URL + `/duty/${dutyId}/unselect-unwanted-day`, {
    method: 'POST',
    headers: { Cookie: c.toString() },
    body: JSON.stringify(data)
  });
};

export const clearSelections = async (dutyId: IDuty['id']) => {
  const c = await cookies();

  await fetch(BASE_API_URL + `/duty/${dutyId}/clear-selections`, {
    method: 'DELETE',
    headers: { Cookie: c.toString() }
  });
};

export const getDuties = async (): Promise<IDuty[]> => {
  const c = await cookies();

  const res = await fetch(BASE_API_URL + '/duty', {
    method: 'GET',
    headers: { Cookie: c.toString() }
  });

  return await res.json();
};

export const getDutyById = async (dutyId: IDuty['id']): Promise<IDuty> => {
  const c = await cookies();

  const res = await fetch(BASE_API_URL + '/duty/' + dutyId, {
    method: 'GET',
    headers: { Cookie: c.toString() }
  });

  return await res.json();
};

export const deleteDutyById = async (dutyId: IDuty['id']): Promise<void> => {
  const c = await cookies();

  await fetch(BASE_API_URL + '/duty/' + dutyId, {
    method: 'DELETE',
    headers: { Cookie: c.toString() }
  });
};

export const addAssistant = async (dutyId: IDuty['id'], data: IDutyAssistant) => {
  const c = await cookies();

  await fetch(BASE_API_URL + '/duty/' + dutyId + '/assistant', {
    method: 'POST',
    headers: { Cookie: c.toString() },
    body: JSON.stringify(data)
  });
};

export const updateAssistant = async (
  dutyId: IDuty['id'],
  assistantId: IDutyAssistant['id'],
  data: Partial<IDutyAssistant>
) => {
  const c = await cookies();

  await fetch(BASE_API_URL + `/duty/${dutyId}/assistant/${assistantId}`, {
    method: 'PATCH',
    headers: { Cookie: c.toString() },
    body: JSON.stringify(data)
  });
};

export const deleteAssistant = async (dutyId: IDuty['id'], assistantId: IDutyAssistant['id']) => {
  const c = await cookies();

  await fetch(BASE_API_URL + `/duty/${dutyId}/assistant/${assistantId}`, {
    method: 'DELETE',
    headers: { Cookie: c.toString() }
  });
};

export const addSection = async (dutyId: IDuty['id'], data: IDutySection) => {
  const c = await cookies();

  delete data.defaultValue;
  await fetch(BASE_API_URL + `/duty/${dutyId}/section`, {
    method: 'POST',
    headers: { Cookie: c.toString() },
    body: JSON.stringify(data)
  });
};

export const updateSection = async (
  dutyId: IDuty['id'],
  sectionId: IDutySection['id'],
  data: Partial<IDutySection>
) => {
  const c = await cookies();

  await fetch(BASE_API_URL + `/duty/${dutyId}/section/${sectionId}`, {
    method: 'PATCH',
    headers: { Cookie: c.toString() },
    body: JSON.stringify(data)
  });
};

export const deleteSection = async (dutyId: IDuty['id'], sectionId: IDutySection['id']) => {
  const c = await cookies();

  await fetch(BASE_API_URL + `/duty/${dutyId}/section/${sectionId}`, {
    method: 'DELETE',
    headers: { Cookie: c.toString() }
  });
};

export const createAssistantSectionConfigsForAssistant = async (
  dutyId: IDuty['id'],
  assistantId: IDutyAssistant['id'],
  data: Array<Pick<IAssistantSectionConfig, 'sectionId' | 'totalLimit'>>
) => {
  if (data.length === 0) return;
  const c = await cookies();

  await fetch(
    BASE_API_URL + `/duty/${dutyId}/assistant/${assistantId}/assistant-section-config/add-many`,
    {
      method: 'POST',
      headers: { Cookie: c.toString() },
      body: JSON.stringify(data)
    }
  );
};

export const deleteAssistantSectionConfigsForAssistant = async (
  dutyId: IDuty['id'],
  assistantId: IDutyAssistant['id']
) => {
  const c = await cookies();

  await fetch(
    BASE_API_URL + `/duty/${dutyId}/assistant/${assistantId}/assistant-section-config/delete-many`,
    {
      method: 'DELETE',
      headers: { Cookie: c.toString() }
    }
  );
};

export const createAssistantSectionConfigsForSection = async (
  dutyId: IDuty['id'],
  sectionId: IDutySection['id'],
  data: Array<Pick<IAssistantSectionConfig, 'assistantId' | 'totalLimit'>>
) => {
  if (data.length === 0) return;
  const c = await cookies();

  await fetch(
    BASE_API_URL + `/duty/${dutyId}/section/${sectionId}/assistant-section-config/add-many`,
    {
      method: 'POST',
      headers: { Cookie: c.toString() },
      body: JSON.stringify(data)
    }
  );
};

export const deleteAssistantSectionConfigsForSection = async (
  dutyId: IDuty['id'],
  sectionId: IDutySection['id']
) => {
  const c = await cookies();

  await fetch(
    BASE_API_URL + `/duty/${dutyId}/section/${sectionId}/assistant-section-config/delete-many`,
    {
      method: 'DELETE',
      headers: { Cookie: c.toString() }
    }
  );
};

export const updateAssistantSectionConfigLimit = async (
  dutyId: IDuty['id'],
  assistantId: IDutyAssistant['id'],
  sectionId: IDutySection['id'],
  totalLimit: IAssistantSectionConfig['totalLimit']
) => {
  const c = await cookies();

  await fetch(BASE_API_URL + `/duty/${dutyId}/assistant-section-config`, {
    method: 'PATCH',
    headers: { Cookie: c.toString() },
    body: JSON.stringify({ assistantId, sectionId, totalLimit })
  });
};
