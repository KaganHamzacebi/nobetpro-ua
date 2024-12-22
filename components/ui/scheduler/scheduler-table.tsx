import { ScreenMode } from '@/libs/enums/screen-mode';
import { IDutyAssistant } from '@/libs/models/duty-model';
import { IMRT_Cell } from '@/libs/models/mrt-model';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';
import dynamic from 'next/dynamic';
import { memo, useMemo } from 'react';

const AssistantNameRenderer = dynamic(
  () => import('@/components/ui/scheduler/table-renderers/assistant-name-renderer'),
  { ssr: false }
);

const SectionCellRenderer = dynamic(
  () => import('@/components/ui/scheduler/table-renderers/section-cell-renderer'),
  { ssr: false }
);

const SectionHeaderRenderer = dynamic(
  () => import('@/components/ui/scheduler/table-renderers/section-header-renderer'),
  { ssr: false }
);

const MonthCellRenderer = dynamic(
  () => import('@/components/ui/scheduler/table-renderers/month-cell-renderer'),
  { ssr: false }
);

function SchedulerTable() {
  const monthConfig = useDutyStore.use.monthConfig();
  const screenMode = useDutyStore.use.screenMode();
  const sectionList = useDutyStore.use.sectionList();
  const assistantList = useDutyStore.use.assistantList();

  const assistantNameColumn = useMemo<MRT_ColumnDef<IDutyAssistant>>(
    () => ({
      id: 'assistant_name',
      accessorKey: 'name',
      header: 'Assistant',
      Cell: ({ row }: IMRT_Cell<IDutyAssistant>) => (
        <AssistantNameRenderer key={`assistant_name-${row.original.id}`} assistant={row.original} />
      )
    }),
    []
  );

  const monthColumns = useMemo<MRT_ColumnDef<IDutyAssistant>[]>(
    () =>
      Array.from({ length: monthConfig.datesInMonth }).map((_, index) => ({
        id: String(index),
        header: 'Month',
        size: 30,
        allowSorting: false,
        mantineTableHeadCellProps: {
          className: `${monthConfig.weekendIndexes.includes(index) ? 'bg-onyx' : undefined}`,
          children: (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <span>{String(index + 1)}</span>
            </div>
          )
        },
        mantineTableBodyCellProps: {
          className: `${monthConfig.weekendIndexes.includes(index) ? 'bg-onyx' : undefined}`
        },
        Cell: ({ row }: IMRT_Cell<IDutyAssistant>) => (
          <MonthCellRenderer
            key={`month_cell-${row.original.id}-${index}`}
            dayIndex={index}
            assistant={row.original}
          />
        )
      })),
    [monthConfig]
  );

  const sectionColumns = useMemo<MRT_ColumnDef<IDutyAssistant>[]>(
    () =>
      sectionList.map(section => ({
        id: 'section-column-' + section.id,
        header: 'Section',
        Header: <SectionHeaderRenderer section={section} />,
        Cell: ({ row }: IMRT_Cell<IDutyAssistant>) => (
          <SectionCellRenderer
            key={`section_cell_${row.original.id}-${section.id}`}
            assistantId={row.original.id}
            sectionId={section.id}
          />
        )
      })),
    [sectionList]
  );

  const columns = useMemo<MRT_ColumnDef<IDutyAssistant>[]>(
    () => [
      assistantNameColumn,
      ...(screenMode === ScreenMode.MonthPicker || screenMode === ScreenMode.UnwantedDayPicker
        ? monthColumns
        : sectionColumns)
    ],
    [assistantNameColumn, monthColumns, screenMode, sectionColumns]
  );

  const table = useMantineReactTable({
    columns: columns,
    data: assistantList,
    enableTopToolbar: false,
    enableBottomToolbar: true,
    enableColumnActions: false,
    enableColumnPinning: true,
    enableStickyHeader: true,
    enablePagination: true,
    paginationDisplayMode: 'pages',
    mantinePaginationProps: {
      showRowsPerPage: false
    },
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      columnPinning: { left: ['assistant_name'] },
      density: 'xs'
    },
    mantineTableProps: {
      withColumnBorders: true,
      highlightOnHover: false
    },
    mantineTableContainerProps: {
      className: 'h-[57vh]'
    },
    getRowId: row => row.id
  });

  return <MantineReactTable<IDutyAssistant> table={table} />;
}

export default memo(SchedulerTable);
