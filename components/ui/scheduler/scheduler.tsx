import { ScreenMode } from '@/libs/enums/screen-mode';
import { monthCellCssClasses } from '@/libs/helpers/mantine-table-css-getters';
import { IAssistant } from '@/libs/models/IAssistant';
import { ISection } from '@/libs/models/ISection';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Row,
  useMantineReactTable
} from 'mantine-react-table';
import { useContext, useMemo } from 'react';
import AssistantNameRenderer from '../table-renderers/assistant-name-renderer';
import MonthCellRenderer from '../table-renderers/month-cell-renderer';
import SectionCellRenderer from '../table-renderers/section-cell-renderer';
import SectionHeaderRenderer from '../table-renderers/section-header-renderer';
import { SchedulerContext } from './scheduler-base';

interface IScheduler {
  isPending: boolean;
  removeAssistant: (assistant: IAssistant) => void;
  setAssistantProps: (assistantId: IAssistant['id'], props: Partial<IAssistant>) => void;
  unwantedDays: Record<string, boolean>;
  toggleUnwantedDay: (assistantId: string, index: number) => void;
  setSectionProps: (sectionId: ISection['id'], props: Partial<ISection>) => void;
  removeSection: (sectionId: ISection['id']) => void;
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
  const { monthConfig, screenMode, assistantList, sectionList } = useContext(SchedulerContext);

  const assistantNameColumnCell = useMemo(() => {
    const AssistantNameCell = ({ row }: { row: MRT_Row<IAssistant> }) => (
      <AssistantNameRenderer
        assistant={row.original}
        setAssistantProps={setAssistantProps}
        removeAssistant={removeAssistant}
      />
    );

    return AssistantNameCell;
  }, [removeAssistant, setAssistantProps]);

  const assistatNameColumn = useMemo<MRT_ColumnDef<IAssistant>>(
    () => ({
      accessorKey: 'name',
      header: 'Assistant',
      Cell: assistantNameColumnCell
    }),
    [assistantNameColumnCell]
  );

  const monthColumns = useMemo<MRT_ColumnDef<IAssistant>[]>(
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
        Cell: ({ row }) => <MonthCellRenderer dayIndex={index} assistant={row.original} />
      })),
    [monthConfig, screenMode, toggleUnwantedDay, unwantedDays]
  );

  const sectionColumns = useMemo<MRT_ColumnDef<IAssistant>[]>(
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
        Cell: ({ row }) => (
          <SectionCellRenderer
            assistant={row.original}
            section={section}
            setAssistantProps={setAssistantProps}
          />
        )
      })),
    [removeSection, sectionList, setAssistantProps, setSectionProps]
  );

  const columns = useMemo<MRT_ColumnDef<IAssistant>[]>(
    () => [
      assistatNameColumn,
      ...(screenMode === ScreenMode.MonthPicker || screenMode === ScreenMode.UnwantedDayPicker
        ? monthColumns
        : sectionColumns)
    ],
    [assistatNameColumn, monthColumns, screenMode, sectionColumns]
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
      className: 'max-h-[700px]'
    },
    state: { isLoading: isPending },
    getRowId: row => row.id
  });

  return (
    <div className="h-full">
      <MantineReactTable<IAssistant> table={table} />
    </div>
  );
}
