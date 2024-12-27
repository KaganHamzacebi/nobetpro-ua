import { ScreenMode } from '@/libs/enums/screen-mode';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { SegmentedControl } from '@mantine/core';
import { memo } from 'react';

function ScreenModeInput() {
  const setScreenMode = useDutyStore.use.setScreenMode();

  const handleScreenModeChange = (mode: ScreenMode) => {
    setScreenMode(mode);
  };

  return (
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
  );
}

export default memo(ScreenModeInput);
