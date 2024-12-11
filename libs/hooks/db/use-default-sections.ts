import { showSuccessNotification } from '@/libs/helpers/notification-service';
import {
  createDefaultSection,
  deleteDefaultSections,
  getDefaultSections,
  updateDefaultSection
} from '@/libs/service/default-section.service';
import { DefaultSection } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const queryKey = ['defaultSections'];

export const useDefaultSection = () => {
  const { data, isLoading: isGetLoading, isFetching: isGetFetching } = useGetQuery();
  const { mutateAsync: createDefaultSection, isPending: isCreating } = useCreateQuery();
  const { mutateAsync: updateDefaultSection, isPending: isUpdating } = useUpdateQuery();
  const { mutateAsync: deleteDefaultSection, isPending: isDeleting } = useDeleteQuery();

  // STATES
  const isLoading = isGetLoading;
  const isPending = isCreating || isDeleting || isUpdating || isGetFetching;

  return {
    createDefaultSection,
    deleteDefaultSection,
    updateDefaultSection,
    defaultSectionList: data ?? [],
    isLoading,
    isPending
  };
};

const useGetQuery = () => {
  return useQuery<DefaultSection[], Error>({
    queryKey: queryKey,
    queryFn: getDefaultSections,
    refetchOnWindowFocus: false
  });
};

const useCreateQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDefaultSection,
    onSuccess: newDefaultSection => {
      queryClient.setQueryData(queryKey, (prev: DefaultSection[]) => [...prev, newDefaultSection]);
      showSuccessNotification({
        title: 'Create Success',
        message: 'Default Section successfully created'
      });
    }
  });
};

const useDeleteQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDefaultSections,
    onSuccess: (deletedIds: string[]) => {
      queryClient.setQueryData(queryKey, (prev: DefaultSection[]) =>
        prev.filter(d => !deletedIds.includes(d.id))
      );
      showSuccessNotification({
        title: 'Delete Success',
        message: 'Default Section(s) successfully deleted'
      });
    }
  });
};

const useUpdateQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDefaultSection,
    onSuccess: (updatedSection: DefaultSection) => {
      queryClient.setQueryData(queryKey, (prev: DefaultSection[]) =>
        prev.map(d => (d.id === updatedSection.id ? updatedSection : d))
      );
      showSuccessNotification({
        title: 'Update Success',
        message: 'Default Section successfully updated'
      });
    }
  });
};
