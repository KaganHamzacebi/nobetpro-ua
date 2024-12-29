import { ScreenMode } from '@/libs/enums/screen-mode';
import { TableState } from '@/libs/enums/table-state';
import { monthCellCssClasses } from '@/libs/helpers/mantine-table-css.helper';
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

type RowType = IDutyAssistant;

function SchedulerTable() {
  const monthConfig = useDutyStore.use.monthConfig();
  const screenMode = useDutyStore.use.screenMode();
  const tableState = useDutyStore.use.tableState();
  const sectionList = useDutyStore.use.sectionList();
  const assistantList = useDutyStore.use.assistantList();
  const unwantedDays = useDutyStore.use.unwantedDays();
  const toggleUnwantedDay = useDutyStore.use.toggleUnwantedDay();

  const page = 1;
  const pageSize = 10;

  const assistantNameColumn = useMemo<MRT_ColumnDef<IDutyAssistant>>(
    () => ({
      id: 'assistant_name',
      accessorKey: 'name',
      header: 'Assistant',
      Cell: ({ row }: IMRT_Cell<RowType>) => (
        <AssistantNameRenderer
          key={`assistant_name-${row.original.id}`}
          assistantId={row.original.id}
        />
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
        mantineTableBodyCellProps: ({ row }) => ({
          onClick: () => toggleUnwantedDay(row.original.id, index),
          className: monthCellCssClasses(
            index,
            row.original.id,
            monthConfig,
            unwantedDays,
            screenMode
          )
        }),
        Cell: ({ row }: IMRT_Cell<RowType>) => (
          <MonthCellRenderer
            key={`month_cell-${row.original.id}-${index}`}
            dayIndex={index}
            assistantId={row.original.id}
          />
        )
      })),
    [monthConfig, screenMode, toggleUnwantedDay, unwantedDays]
  );

  const sectionColumns = useMemo<MRT_ColumnDef<IDutyAssistant>[]>(
    () =>
      sectionList.map(section => ({
        id: 'section-column-' + section.id,
        header: 'Section',
        Header: <SectionHeaderRenderer section={section} />,
        Cell: ({ row }: IMRT_Cell<RowType>) => (
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
    state: {
      showSkeletons: tableState === TableState.Loading,
      showLoadingOverlay: tableState === TableState.Loading
    },
    initialState: {
      pagination: { pageSize: pageSize, pageIndex: page - 1 },
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
