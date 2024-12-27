import { useDutyStore } from '@/libs/stores/use-duty-store';
import { MonthPickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { memo } from 'react';

const TODAY = dayjs().toDate();

function DSMonthPickerInput() {
  const setDate = useDutyStore.use.setDate();
  const isAnySelected = useDutyStore.use.selectedDays().length > 0;

  const onDateChange = (date: Date | null) => {
    if (date == null) throw new Error('Date cannot be null');
    setDate(date);
  };

  return (
    <MonthPickerInput
      disabled={isAnySelected}
      minDate={TODAY}
      maxLevel="year"
      allowDeselect={false}
      onChange={onDateChange}
      defaultValue={TODAY}
      label="Pick Month"
      leftSection={<IconCalendar />}
      leftSectionPointerEvents="none"
      className="w-[10rem]"
    />
  );
}

export default memo(DSMonthPickerInput);
