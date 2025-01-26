import { ScreenMode } from '@/libs/enums/screen-mode';
import { TableState } from '@/libs/enums/table-state';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { SegmentedControl } from '@mantine/core';
import { memo, useEffect, useTransition } from 'react';

function ScreenModeInput() {
  const screenMode = useDutyStore.use.screenMode();
  const setTableState = useDutyStore.use.setTableState();
  const setScreenMode = useDutyStore.use.setScreenMode();
  const [loading, setTransition] = useTransition();

  useEffect(() => {
    setTableState(loading ? TableState.Loading : TableState.Active);
  }, [loading, setTableState]);

  const handleScreenModeChange = (mode: ScreenMode) => {
    setTransition(() => {
      setScreenMode(mode);
    });
  };

  return (
    <SegmentedControl
      defaultValue={screenMode}
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
