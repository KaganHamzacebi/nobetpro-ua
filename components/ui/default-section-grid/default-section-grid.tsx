'use client';

import { caseInsensitiveSorter } from '@/libs/helpers/case-insensitive-sorter.helper';
import { useDefaultSection } from '@/libs/hooks/db/use-default-sections';
import { IDefaultSection } from '@/libs/models/ISection';
import {
  OnCreatingRowSave,
  RenderRowActions,
  RenderTopToolbarCustomActions
} from '@/libs/models/MRTGridTypes';
import { Button, Group, Text, UnstyledButton } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  useMantineReactTable
} from 'mantine-react-table';
import { useCallback, useMemo } from 'react';

export default function DefaultSectionGrid() {
  const {
    createDefaultSection,
    updateDefaultSection,
    deleteDefaultSection,
    defaultSectionList,
    isLoading,
    isPending
  } = useDefaultSection();

  // CREATE action
  const onCreatingRowSave = useCallback<OnCreatingRowSave<IDefaultSection>>(
    ({ values, exitCreatingMode }) => {
      const handleCreation = async () => {
        await createDefaultSection({ name: values.name });
        exitCreatingMode();
      };

      handleCreation();
    },
    [createDefaultSection]
  );

  // Explicitly type the function
  const handleUpdateSection = useCallback(
    (
      table: MRT_TableInstance<IDefaultSection>,
      row: MRT_Row<IDefaultSection>,
      value: string,
      field: keyof IDefaultSection
    ): void => {
      // If currently creating a section, bypass the update logic
      const isCreating = !!table.getState().creatingRow; // Ensure 'table' is properly typed
      if (isCreating) return;

      const updatedDefaultSection = {
        id: row.original.id,
        [field]: value
      };
      updateDefaultSection(updatedDefaultSection);
    },
    [updateDefaultSection] // Add 'table' as a dependency if needed
  );

  // DELETE action
  const handleDeleteSelectedDefaultSections = useCallback(
    async (table: MRT_TableInstance<IDefaultSection>) => {
      const idsToDelete = Object.keys(table.getSelectedRowModel().rowsById);
      if (idsToDelete.length == 0) {
        throw new Error('There is no selected sections to delete');
      }

      await deleteDefaultSection(idsToDelete);
      table.resetRowSelection();
    },
    [deleteDefaultSection]
  );

  const deleteSection = useCallback(
    async (defaultSectionId: string, table: MRT_TableInstance<IDefaultSection>) => {
      await deleteDefaultSection([defaultSectionId]);
      table.resetRowSelection();
    },
    [deleteDefaultSection]
  );

  const askForDeletion = useCallback((onConfirmFn: () => void) => {
    modals.openConfirmModal({
      title: 'Please confirm deletion',
      centered: true,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      children: (
        <Text size="sm">
          Are you sure that you want to delete the selected default section(s)? Selected Default
          Section will be deleted after the confirmation!
        </Text>
      ),
      onConfirm: onConfirmFn
    });
  }, []);

  const columns = useMemo<MRT_ColumnDef<IDefaultSection>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        sortingFn: caseInsensitiveSorter,
        mantineEditTextInputProps: ({ row, table }) => ({
          type: 'text',
          onBlur: event => handleUpdateSection(table, row, event.target.value, 'name')
        })
      },
      {
        accessorKey: 'defaultValue',
        header: 'Value',
        sortingFn: caseInsensitiveSorter,
        mantineEditTextInputProps: ({ row, table }) => ({
          type: 'text',
          onBlur: event => handleUpdateSection(table, row, event.target.value, 'defaultValue')
        })
      },
      {
        accessorKey: 'color',
        header: 'Color',
        sortingFn: caseInsensitiveSorter,
        mantineEditTextInputProps: ({ row, table }) => ({
          type: 'text',
          onBlur: event => handleUpdateSection(table, row, event.target.value, 'defaultValue')
        })
      }
    ],
    [handleUpdateSection]
  );

  const openEditingRow = useCallback((table: MRT_TableInstance<IDefaultSection>) => {
    table.setCreatingRow(true);
  }, []);

  // Top Toolbar Custom Actions
  const renderTopToolbarCustomActions = useCallback<RenderTopToolbarCustomActions<IDefaultSection>>(
    ({ table }) => (
      <Group>
        <Button onClick={() => openEditingRow(table)}>New Section</Button>
        <Button
          onClick={() => askForDeletion(() => handleDeleteSelectedDefaultSections(table))}
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          variant="outline"
          color="red">
          Remove Selected
        </Button>
      </Group>
    ),
    [askForDeletion, handleDeleteSelectedDefaultSections, openEditingRow]
  );

  // Row Actions
  const renderRowActions = useCallback<RenderRowActions<IDefaultSection>>(
    ({ row, table }) => (
      <Group content="center">
        <UnstyledButton
          color="red"
          onClick={() => askForDeletion(() => deleteSection(row.original.id, table))}>
          <IconTrash size={20} color="red" />
        </UnstyledButton>
      </Group>
    ),
    [askForDeletion, deleteSection]
  );

  const table = useMantineReactTable<IDefaultSection>({
    columns: columns,
    data: defaultSectionList,
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
