import { ScreenMode } from '@/libs/enums/screen-mode';
import { monthCellCssClasses } from '@/libs/helpers/mantine-table-css-getters';
import { IDutyAssistant } from '@/libs/models/IAssistant';
import { DutySection } from '@prisma/client';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Row,
  useMantineReactTable
} from 'mantine-react-table';
import { useMemo } from 'react';
import AssistantNameRenderer from '../table-renderers/assistant-name-renderer';
import MonthCellRenderer from '../table-renderers/month-cell-renderer';
import SectionCellRenderer from '../table-renderers/section-cell-renderer';
import SectionHeaderRenderer from '../table-renderers/section-header-renderer';
import { useSchedulerContext } from './scheduler-base';

interface IScheduler {
  isPending: boolean;
  removeAssistant: (assistant: IDutyAssistant) => void;
  setAssistantProps: (assistantId: IDutyAssistant['id'], props: Partial<IDutyAssistant>) => void;
  unwantedDays: Record<string, boolean>;
  toggleUnwantedDay: (assistantId: string, index: number) => void;
  setSectionProps: (sectionId: DutySection['id'], props: Partial<DutySection>) => void;
  removeSection: (sectionId: DutySection['id']) => void;
}

export default function Scheduler({
  isPending,
  removeAssistant,
  setAssistantProps,
  unwantedDays,
  toggleUnwantedDay,
  setSectionProps,
  removeSection
}: Readonly<IScheduler>) {
  const { monthConfig, screenMode, assistantList, sectionList, sectionConfigList } =
    useSchedulerContext();

  const assistantNameColumnCell = useMemo(() => {
    return ({ row }: { row: MRT_Row<IDutyAssistant> }) => (
      <AssistantNameRenderer
        assistant={row.original}
        setAssistantProps={setAssistantProps}
        removeAssistant={removeAssistant}
      />
    );
  }, [removeAssistant, setAssistantProps]);

  const assistantNameColumn = useMemo<MRT_ColumnDef<IDutyAssistant>>(
    () => ({
      accessorKey: 'name',
      header: 'Assistant',
      Cell: assistantNameColumnCell
    }),
    [assistantNameColumnCell]
  );

  const monthColumns = useMemo<MRT_ColumnDef<IDutyAssistant>[]>(
    () =>
      Array.from({ length: monthConfig.datesInMonth }).map((_, index) => ({
        id: String(index),
        header: 'Month',
        size: 30,
        mantineTableHeadCellProps: {
          className: `${monthConfig.weekendIndexes.includes(index) ? 'bg-onyx' : undefined}`,
          children: (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <span>{String(index + 1)}</span>
            </div>
          )
        },
        mantineTableBodyCellProps: ({ row }) => ({
          className: monthCellCssClasses(
            index,
            row.original.id,
            monthConfig,
            unwantedDays,
            screenMode
          ),
          onClick: () => toggleUnwantedDay(row.original.id, index)
        }),
        Cell: ({ row }: { row: MRT_Row<IDutyAssistant> }) => (
          <MonthCellRenderer dayIndex={index} assistant={row.original} />
        )
      })),
    [monthConfig, screenMode, toggleUnwantedDay, unwantedDays]
  );

  const sectionColumns = useMemo<MRT_ColumnDef<IDutyAssistant>[]>(
    () =>
      sectionList.map(section => ({
        id: section.id,
        header: 'Section',
        Header: (
          <SectionHeaderRenderer
            section={section}
            setSectionProps={setSectionProps}
            removeSection={removeSection}
          />
        ),
        Cell: ({ row }: { row: MRT_Row<IDutyAssistant> }) => (
          <SectionCellRenderer
            assistant={row.original}
            section={section}
            sectionConfig={sectionConfigList.find(i => i.assistantId === row.original.id)!}
          />
        )
      })),
    [removeSection, sectionConfigList, sectionList, setSectionProps]
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
    enableBottomToolbar: false,
    enablePagination: false,
    enableColumnActions: false,
    enableColumnPinning: true,
    initialState: {
      columnPinning: { left: ['name'] },
      density: 'xs'
    },
    mantineTableProps: {
      withColumnBorders: true,
      highlightOnHover: false
    },
    mantineTableContainerProps: {
      className: 'h-[64vh]'
    },
    state: { isLoading: isPending },
    getRowId: row => row.id
  });

  return (
    <div className="h-full">
      <MantineReactTable<IDutyAssistant> table={table} />
    </div>
  );
}
