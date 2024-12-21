import ExportModal from '@/components/ui/export-modal';
import { ScreenMode } from '@/libs/enums/screen-mode';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { Group, NumberInput, SegmentedControl } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { memo } from 'react';

function SchedulerTopBar() {
  console.log('scheduler top bar renderin');
  const setDate = useDutyStore.use.setDate();
  const setRestDays = useDutyStore.use.setRestDays();
  const setScreenMode = useDutyStore.use.setScreenMode();
  const numberOfRestDays = useDutyStore.use.numberOfRestDays();

  const handleScreenModeChange = (mode: ScreenMode) => {
    setScreenMode(mode);
  };

  const handleRestDayChange = (value: string | number) => {
    setRestDays(Number(value));
  };

  const onDateChange = (date: Date | null) => {
    if (date == null) throw new Error('Date cannot be null');
    setDate(date);
  };

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
        value={numberOfRestDays}
        onChange={handleRestDayChange}
        min={0}
        clampBehavior="strict"
        allowNegative={false}
        allowDecimal={false}
      />
      <div className="ml-auto mt-auto flex flex-row gap-x-4">
        <ExportModal />
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

export default memo(SchedulerTopBar);
