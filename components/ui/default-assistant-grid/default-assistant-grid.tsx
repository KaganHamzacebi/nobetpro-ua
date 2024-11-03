'use client';

import { showSuccessNotification } from '@/libs/helpers/notification-service';
import {
  useCreateDefaultAssistant,
  useGetDefaultAssistants
} from '@/libs/hooks/db/use-default-assisants';
import { IDefaultAssistant } from '@/libs/models/IAssistant';
import { Button, Group, UnstyledButton } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_TableOptions,
  useMantineReactTable
} from 'mantine-react-table';
import { useEffect, useMemo } from 'react';

export default function DefaultAssistantGrid() {
  const {
    data: defaultAssistantList = [],
    isError,
    isLoading,
    isFetching
  } = useGetDefaultAssistants();

  const {
    mutateAsync: createDefaultAssistant,
    isPending: isCreating,
    isSuccess: isCreatingSuccess
  } = useCreateDefaultAssistant();

  useEffect(() => {
    if (isCreatingSuccess) {
      showSuccessNotification({
        title: 'Success',
        message: 'New Assistant Successfully Created'
      });
    }
  }, [isCreatingSuccess]);

  const columns = useMemo<MRT_ColumnDef<IDefaultAssistant>[]>(
    () => [{ accessorKey: 'name', header: 'Name' }],
    []
  );

  //CREATE action
  const handleCreateUser: MRT_TableOptions<IDefaultAssistant>['onCreatingRowSave'] = async ({
    values,
    exitCreatingMode
  }) => {
    await createDefaultAssistant({ name: values.name });
    exitCreatingMode();
  };

  const table = useMantineReactTable({
    columns: columns,
    data: defaultAssistantList,
    enableEditing: true,
    enableRowSelection: true,
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'cell', // ('modal', 'row', 'table', and 'custom' are also available)
    enableRowActions: true,
    enableRowNumbers: true,
    rowNumberDisplayMode: 'original',
    positionToolbarAlertBanner: 'bottom',
    positionActionsColumn: 'last',
    getRowId: row => row.id,
    initialState: { density: 'xs' },
    state: {
      isLoading: isLoading,
      isSaving: isCreating,
      showProgressBars: isFetching
    },
    mantineToolbarAlertBannerProps: isError
      ? {
          color: 'red',
          children: 'Error loading data'
        }
      : undefined,
    renderRowActions: ({ row }) => (
      <Group content="center">
        <UnstyledButton color="red">
          <IconTrash size={20} color="red" />
        </UnstyledButton>
      </Group>
    ),
    onCreatingRowSave: handleCreateUser,
    renderTopToolbarCustomActions: ({ table }) => (
      <Group>
        <Button onClick={openEditingRow}>New Assistant</Button>
        <Button
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          variant="outline"
          color="red">
          Remove Selected
        </Button>
      </Group>
    ),
    mantineTopToolbarProps: { className: 'border-b border-silver border-opacity-50' }
  });

  const openEditingRow = () => {
    table.setCreatingRow(true);
  };

  return (
    <div className="h-full">
      <MantineReactTable table={table} />
    </div>
  );
}
