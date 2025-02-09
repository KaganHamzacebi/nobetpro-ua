import { ScreenMode } from '@/libs/enums/screen-mode';
import { TableState } from '@/libs/enums/table-state';
import { setSearchParam } from '@/libs/helpers/route.helper';
import { IDutyAssistant } from '@/libs/models/duty-model';
import { IMRT_Cell } from '@/libs/models/mrt-model';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { memo, useEffect, useMemo, useState } from 'react';

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
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');

  const monthConfig = useDutyStore.use.monthConfig();
  const screenMode = useDutyStore.use.screenMode();
  const tableState = useDutyStore.use.tableState();
  const sectionList = useDutyStore.use.sectionList();
  const assistantList = useDutyStore.use.assistantList();

  const pageSize = 10;
  const initialPage = pageParam ? parseInt(pageParam) - 1 : 0;
  const totalPages = Math.ceil(assistantList.length / pageSize);

  const [pagination, setPagination] = useState({
    pageIndex: initialPage,
    pageSize: pageSize
  });

  useEffect(() => {
    const page = pagination.pageIndex + 1;
    setSearchParam('page', page);
  }, [pagination.pageIndex, pagination.pageSize]);

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
        Cell: ({ row }: IMRT_Cell<RowType>) => (
          <MonthCellRenderer
            key={`month_cell-${row.original.id}-${index}`}
            dayIndex={index}
            assistantId={row.original.id}
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
    autoResetPageIndex: false,
    paginationDisplayMode: 'pages',
    onPaginationChange: setPagination,
    pageCount: totalPages,
    mantinePaginationProps: {
      showRowsPerPage: false,
      total: totalPages
    },
    state: {
      showLoadingOverlay: tableState === TableState.Loading,
      pagination: pagination
    },
    initialState: {
      columnPinning: { left: ['assistant_name'] },
      density: 'xs'
    },
    mantineTableBodyCellProps: {
      style: { padding: '0', height: 'fit-content', width: 'fit-content' }
    },
    mantineTableHeadCellProps: {
      style: { padding: '0.5rem', height: 'fit-content', width: 'fit-content' }
    },
    mantineTableProps: {
      withColumnBorders: true,
      highlightOnHover: false
    },
    mantineTableContainerProps: {
      style: { height: '56vh' }
    },
    getRowId: row => row.id
  });

  return <MantineReactTable<IDutyAssistant> table={table} />;
}

export default memo(SchedulerTable);
