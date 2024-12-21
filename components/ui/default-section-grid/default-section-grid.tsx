'use client';

import { caseInsensitiveSorter } from '@/libs/helpers/case-insensitive-sorter.helper';
import { useDefaultSection } from '@/libs/hooks/use-default-sections';
import {
  OnCreatingRowSave,
  RenderRowActions,
  RenderTopToolbarCustomActions
} from '@/libs/models/mrt-model';
import { Button, Group, NumberInput, Text, UnstyledButton } from '@mantine/core';
import { modals } from '@mantine/modals';
import { type DefaultSection } from '@prisma/client';
import { IconTrash } from '@tabler/icons-react';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  useMantineReactTable
} from 'mantine-react-table';
import { useCallback, useMemo, useState } from 'react';
import DSColorPicker from '../color-picker';

export default function DefaultSectionGrid() {
  const [creatingState, setCreatingState] = useState<Partial<DefaultSection>>({
    color: '',
    defaultValue: 0
  });

  const {
    createDefaultSection,
    updateDefaultSection,
    deleteDefaultSection,
    defaultSectionList,
    isLoading,
    isPending
  } = useDefaultSection();

  // CREATE action
  const onCreatingRowSave = useCallback<OnCreatingRowSave<DefaultSection>>(
    ({ values, exitCreatingMode }) => {
      const handleCreation = async () => {
        await createDefaultSection({
          name: values.name,
          defaultValue: creatingState.defaultValue,
          color: creatingState.color
        });
        exitCreatingMode();
      };

      handleCreation();
    },
    [createDefaultSection, creatingState.color, creatingState.defaultValue]
  );

  // Explicitly type the function
  const handleUpdateSection = useCallback(
    (
      table: MRT_TableInstance<DefaultSection>,
      row: MRT_Row<DefaultSection>,
      value: unknown,
      field: keyof DefaultSection
    ): void => {
      // If currently creating a section, bypass the update logic
      const isCreating = !!table.getState().creatingRow; // Ensure 'table' is properly typed
      if (isCreating) return;

      const updatedDefaultSection = {
        id: row.original.id,
        [field]: value
      };
      updateDefaultSection(updatedDefaultSection);
      table.setEditingCell(null);
    },
    [updateDefaultSection] // Add 'table' as a dependency if needed
  );

  // DELETE action
  const handleDeleteSelectedDefaultSections = useCallback(
    async (table: MRT_TableInstance<DefaultSection>) => {
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
    async (defaultSectionId: string, table: MRT_TableInstance<DefaultSection>) => {
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

  const handleCreationValues = useCallback(
    <T extends keyof DefaultSection>(value: DefaultSection[T], field: T, isCreating: boolean) => {
      if (isCreating) {
        setCreatingState(prev => ({
          ...prev,
          [field]: value
        }));
      }
    },
    []
  );

  const columns = useMemo<MRT_ColumnDef<DefaultSection>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        sortingFn: caseInsensitiveSorter,
        mantineEditTextInputProps: ({ row, table }) => ({
          type: 'text',
          onBlur: e => handleUpdateSection(table, row, e.target.value, 'name')
        })
      },
      {
        accessorKey: 'defaultValue',
        header: 'Value',
        sortingFn: caseInsensitiveSorter,
        Edit: ({ row, table }) => (
          <NumberInput
            defaultValue={row.original.defaultValue}
            allowNegative={false}
            onChange={value =>
              handleCreationValues(Number(value), 'defaultValue', !row.original.id)
            }
            onBlur={e => handleUpdateSection(table, row, Number(e.target.value), 'defaultValue')}
          />
        )
      },
      {
        accessorKey: 'color',
        header: 'Color',
        sortingFn: caseInsensitiveSorter,
        enableEditing: false,
        Cell: ({ row, table }) => (
          <DSColorPicker
            color={row.original.color}
            onChange={value => handleCreationValues(value, 'color', !row.original.id)}
            onClose={color => handleUpdateSection(table, row, color, 'color')}
          />
        )
      }
    ],
    [handleCreationValues, handleUpdateSection]
  );

  const openEditingRow = useCallback((table: MRT_TableInstance<DefaultSection>) => {
    table.setCreatingRow(true);
  }, []);

  // Top Toolbar Custom Actions
  const renderTopToolbarCustomActions = useCallback<RenderTopToolbarCustomActions<DefaultSection>>(
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
  const renderRowActions = useCallback<RenderRowActions<DefaultSection>>(
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

  const table = useMantineReactTable<DefaultSection>({
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
