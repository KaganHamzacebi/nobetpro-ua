'use client';

import { caseInsensitiveSorter } from '@/libs/helpers/case-insensitive-sorter.helper';
import { useDefaultAssistant } from '@/libs/hooks/db/use-default-assisants';
import { IDefaultAssistant } from '@/libs/models/IAssistant';
import { Button, Group, Text, UnstyledButton } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  MRT_TableOptions,
  useMantineReactTable
} from 'mantine-react-table';
import { useCallback, useMemo } from 'react';

type OnCreatingRowSave = NonNullable<MRT_TableOptions<IDefaultAssistant>['onCreatingRowSave']>;
type RenderRowActions = NonNullable<MRT_TableOptions<IDefaultAssistant>['renderRowActions']>;
type RenderTopToolbarCustomActions = NonNullable<
  MRT_TableOptions<IDefaultAssistant>['renderTopToolbarCustomActions']
>;

export default function DefaultAssistantGrid() {
  const {
    createDefaultAssistant,
    deleteDefaultAssistant,
    updateDefaultAssistant,
    defaultAssistantList,
    isLoading,
    isPending
  } = useDefaultAssistant();

  // CREATE action
  const onCreatingRowSave = useCallback<OnCreatingRowSave>(
    ({ values, exitCreatingMode }) => {
      const handleCreation = async () => {
        await createDefaultAssistant({ name: values.name });
        exitCreatingMode();
      };

      handleCreation();
    },
    [createDefaultAssistant]
  );

  // Explicitly type the function
  const handleUpdateAssistant = useCallback(
    (
      table: MRT_TableInstance<IDefaultAssistant>,
      row: MRT_Row<IDefaultAssistant>,
      value: string,
      field: keyof IDefaultAssistant
    ): void => {
      // If currently creating an assistant, bypass the update logic
      const isCreating = !!table.getState().creatingRow; // Ensure 'table' is properly typed
      if (isCreating) return;

      const updatedDefaultAssistants = {
        id: row.original.id,
        [field]: value
      };
      updateDefaultAssistant(updatedDefaultAssistants); // Ensure 'updateDefaultAssistant' is typed
    },
    [updateDefaultAssistant] // Add 'table' as a dependency if needed
  );

  // DELETE action
  const handleDeleteSelectedDefaultAssistants = useCallback(
    async (table: MRT_TableInstance<IDefaultAssistant>) => {
      const idsToDelete = Object.keys(table.getSelectedRowModel().rowsById);
      if (idsToDelete.length == 0) {
        throw new Error('There is no selected assistants to delete');
      }

      await deleteDefaultAssistant(idsToDelete);
      table.resetRowSelection();
    },
    [deleteDefaultAssistant]
  );

  const deleteAssistant = useCallback(
    async (defaultAssistantId: string, table: MRT_TableInstance<IDefaultAssistant>) => {
      await deleteDefaultAssistant([defaultAssistantId]);
      table.resetRowSelection();
    },
    [deleteDefaultAssistant]
  );

  const askForDeletion = useCallback((onConfirmFn: () => void) => {
    modals.openConfirmModal({
      title: 'Please confirm deletion',
      centered: true,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      children: (
        <Text size="sm">
          Are you sure that you want to delete the selected default assistant(s)? Selected Default
          Assistant will be deleted after the confirmation!
        </Text>
      ),
      onConfirm: onConfirmFn
    });
  }, []);

  const columns = useMemo<MRT_ColumnDef<IDefaultAssistant>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        sortingFn: caseInsensitiveSorter,
        mantineEditTextInputProps: ({ row, table }) => ({
          type: 'text',
          onBlur: event => handleUpdateAssistant(table, row, event.target.value, 'name')
        })
      }
    ],
    [handleUpdateAssistant]
  );

  const openEditingRow = useCallback((table: MRT_TableInstance<IDefaultAssistant>) => {
    table.setCreatingRow(true);
  }, []);

  // Top Toolbar Custom Actions
  const renderTopToolbarCustomActions = useCallback<RenderTopToolbarCustomActions>(
    ({ table }) => (
      <Group>
        <Button onClick={() => openEditingRow(table)}>New Assistant</Button>
        <Button
          onClick={() => askForDeletion(() => handleDeleteSelectedDefaultAssistants(table))}
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          variant="outline"
          color="red">
          Remove Selected
        </Button>
      </Group>
    ),
    [askForDeletion, handleDeleteSelectedDefaultAssistants, openEditingRow]
  );

  // Row Actions
  const renderRowActions = useCallback<RenderRowActions>(
    ({ row, table }) => (
      <Group content="center">
        <UnstyledButton
          color="red"
          onClick={() => askForDeletion(() => deleteAssistant(row.original.id, table))}>
          <IconTrash size={20} color="red" />
        </UnstyledButton>
      </Group>
    ),
    [askForDeletion, deleteAssistant]
  );

  const table = useMantineReactTable<IDefaultAssistant>({
    columns: columns,
    data: defaultAssistantList,
    enableEditing: true,
    enablePagination: false,
    enableRowSelection: true,
    enableRowActions: true,
    enableRowNumbers: true,
    enableDensityToggle: false,
    positionToolbarAlertBanner: 'bottom',
    positionActionsColumn: 'last',
    createDisplayMode: 'row',
    editDisplayMode: 'cell',
    getRowId: row => row.id,
    onCreatingRowSave,
    renderRowActions,
    renderTopToolbarCustomActions,
    mantineTopToolbarProps: { className: 'border-b border-silver border-opacity-50' },
    initialState: { density: 'xs', sorting: [{ id: 'name', desc: false }] },
    state: {
      isLoading: isLoading,
      isSaving: isPending,
      showProgressBars: isPending
    }
  });

  return (
    <div className="h-full">
      <MantineReactTable table={table} />
    </div>
  );
}
