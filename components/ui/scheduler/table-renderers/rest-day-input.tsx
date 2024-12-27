import { useDutyStore } from '@/libs/stores/use-duty-store';
import { NumberInput } from '@mantine/core';
import { memo } from 'react';

function RestDayInput() {
  const numberOfRestDays = useDutyStore.use.numberOfRestDays();
  const setRestDays = useDutyStore.use.setRestDays();
  const isAnySelected = useDutyStore.use.selectedDays().length > 0;

  const handleRestDayChange = (value: string | number) => {
    setRestDays(Number(value));
  };

  return (
    <NumberInput
      disabled={isAnySelected}
      className="w-fit"
      label="Number of Rest days"
      value={numberOfRestDays}
      onChange={handleRestDayChange}
      min={0}
      clampBehavior="strict"
      allowNegative={false}
      allowDecimal={false}
    />
  );
}

export default memo(RestDayInput);
