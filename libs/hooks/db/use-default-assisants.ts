import { BASE_API_URL } from '@/libs/consts/api';
import { IDefaultAssistant } from '@/libs/models/IAssistant';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetDefaultAssistants = () => {
  return useQuery<IDefaultAssistant[], Error>({
    queryKey: ['defaultAssistants'],
    queryFn: getDefaultAssistants,
    refetchOnWindowFocus: false
  });
};

const getDefaultAssistants = async () => {
  const response = await fetch(BASE_API_URL + `/default-assistants`);
  if (!response.ok) {
    throw new Error('Error fetching default assistants');
  }

  return response.json();
};

export const useCreateDefaultAssistant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDefaultAssistant,
    onMutate: newDefaultAssistant => {
      queryClient.setQueryData(['defaultAssistants'], (prev: IDefaultAssistant[]) => [
        ...prev,
        newDefaultAssistant
      ]);
    }
  });
};

const createDefaultAssistant = async (defaultAssistant: { name: string }) => {
  const response = await fetch(BASE_API_URL + `/default-assistants`, {
    method: 'POST',
    body: JSON.stringify(defaultAssistant)
  });

  if (!response.ok) {
    throw new Error('Error creating default assistants');
  }

  return response.json();
};
