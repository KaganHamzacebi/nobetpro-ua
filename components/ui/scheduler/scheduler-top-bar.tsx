import ExportModal from '@/components/ui/export-modal';
import { useSchedulerContext } from '@/components/ui/scheduler/scheduler-base';
import { ScreenMode } from '@/libs/enums/screen-mode';
import { Group, NumberInput, SegmentedControl } from '@mantine/core';
import { DateValue, MonthPickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useMemo } from 'react';

interface ISchedulerTopBar {
  onDateChange: (newDate: DateValue) => void;
  setNumberOfRestDays: (restDays: string | number) => void;
  handleScreenModeChange: (screenMode: ScreenMode) => void;
}

export default function SchedulerTopBar({
  onDateChange,
  setNumberOfRestDays,
  handleScreenModeChange
}: Readonly<ISchedulerTopBar>) {
  const { monthConfig, assistantList, sectionList } = useSchedulerContext();

  const isRestDayDayDisabled = useMemo(() => {
    return false;
  }, []);

  return (
    <Group>
      <MonthPickerInput
        minDate={dayjs().toDate()}
        maxLevel="year"
        allowDeselect={false}
        onChange={onDateChange}
        defaultValue={dayjs().toDate()}
        label="Pick Month"
        leftSection={<IconCalendar />}
        leftSectionPointerEvents="none"
        className="w-[10rem]"
      />
      <NumberInput
        className="w-fit"
        label="Number of Rest days"
        value={monthConfig.numberOfRestDays}
        onChange={setNumberOfRestDays}
        min={0}
        disabled={isRestDayDayDisabled}
        clampBehavior="strict"
        allowNegative={false}
        allowDecimal={false}
      />
      <div className="ml-auto mt-auto flex flex-row gap-x-4">
        <ExportModal assistantList={assistantList} sectionList={sectionList} />
        <SegmentedControl
          defaultValue={ScreenMode.MonthPicker}
          onChange={e => handleScreenModeChange(e as ScreenMode)}
          color="yellow"
          data={[
            { label: 'Month Picker', value: ScreenMode.MonthPicker },
            {
              label: 'Unwanted Day Picker',
              value: ScreenMode.UnwantedDayPicker
            },
            { label: 'Section Editor', value: ScreenMode.SectionEditor }
          ]}
        />
      </div>
    </Group>
  );
}
