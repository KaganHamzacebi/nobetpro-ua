import { showSuccessNotification } from '@/libs/helpers/notification-service';
import { IDefaultAssistant } from '@/libs/models/IAssistant';
import {
  createDefaultAssistant,
  deleteDefaultAssistants,
  getDefaultAssistants,
  updateDefaultAssistant
} from '@/libs/service/default-assistant.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useDefaultAssistant = () => {
  useEffect(() => {
    const fetchAssistants = async () => await getDefaultAssistants();
    fetchAssistants();
  }, []);

  const { data, isLoading: isGetLoading, isFetching: isGetFetching } = useGetQuery();
  const { mutateAsync: createDefaultAssistant, isPending: isCreating } = useCreateQuery();
  const { mutateAsync: updateDefaultAssistant, isPending: isUpdating } = useUpdateQuery();
  const { mutateAsync: deleteDefaultAssistant, isPending: isDeleting } = useDeleteQuery();

  // STATES
  const isLoading = isGetLoading;
  const isPending = isCreating || isDeleting || isUpdating || isGetFetching;

  return {
    createDefaultAssistant,
    deleteDefaultAssistant,
    updateDefaultAssistant,
    defaultAssistantList: data ?? [],
    isLoading,
    isPending
  };
};

const useGetQuery = () => {
  return useQuery<IDefaultAssistant[], Error>({
    queryKey: ['defaultAssistants'],
    queryFn: getDefaultAssistants,
    refetchOnWindowFocus: false
  });
};

const useCreateQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDefaultAssistant,
    onSuccess: newDefaultAssistant => {
      queryClient.setQueryData(['defaultAssistants'], (prev: IDefaultAssistant[]) => [
        ...prev,
        newDefaultAssistant
      ]);
      showSuccessNotification({
        title: 'Create Success',
        message: 'Default Assistant successfully created'
      });
    }
  });
};

const useDeleteQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDefaultAssistants,
    onSuccess: (deletedIds: string[]) => {
      queryClient.setQueryData(['defaultAssistants'], (prev: IDefaultAssistant[]) =>
        prev.filter(d => !deletedIds.includes(d.id))
      );
      showSuccessNotification({
        title: 'Delete Success',
        message: 'Default Assistant(s) successfully deleted'
      });
    }
  });
};

const useUpdateQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDefaultAssistant,
    onSuccess: (updatedAssistant: IDefaultAssistant) => {
      queryClient.setQueryData(['defaultAssistants'], (prev: IDefaultAssistant[]) =>
        prev.map(d => (d.id === updatedAssistant.id ? updatedAssistant : d))
      );
      showSuccessNotification({
        title: 'Update Success',
        message: 'Default Assistant successfully updated'
      });
    }
  });
};
