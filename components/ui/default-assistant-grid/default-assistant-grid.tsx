'use client';

import { IDefaultAssistant } from '@/libs/models/IAssistant';
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';
import { useMemo } from 'react';

interface IDefaultAssistantGrid {
  assistantList: IDefaultAssistant[];
}

export default function DefaultAssistantGrid({ assistantList }: Readonly<IDefaultAssistantGrid>) {
  const columns = useMemo<MRT_ColumnDef<IDefaultAssistant>[]>(
    () => [
      { accessorKey: 'order', header: '#', size: 20, grow: false },
      { accessorKey: 'name', header: 'Name' }
    ],
    []
  );

  const table = useMantineReactTable({
    columns: columns,
    data: assistantList,
    enableEditing: true,
    initialState: { density: 'xs' }
  });

  return (
    <div className="h-full">
      <MantineReactTable<IDefaultAssistant> table={table} />
    </div>
  );
}
