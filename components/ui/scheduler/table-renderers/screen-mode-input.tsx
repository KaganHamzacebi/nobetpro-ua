import { ScreenMode } from '@/libs/enums/screen-mode';
import { TableState } from '@/libs/enums/table-state';
import { setSearchParam } from '@/libs/helpers/route.helper';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { SegmentedControl } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { memo, useCallback, useEffect, useState, useTransition } from 'react';

const screenModes = [
  { label: 'Month Picker', value: ScreenMode.MonthPicker },
  { label: 'Unwanted Day Picker', value: ScreenMode.UnwantedDayPicker },
  { label: 'Section Editor', value: ScreenMode.SectionEditor }
];

function ScreenModeInput() {
  const searchParams = useSearchParams();
  const screenModeParam = searchParams.get('screenMode') as ScreenMode | null;

  const setScreenMode = useDutyStore.use.setScreenMode();
  const setTableState = useDutyStore.use.setTableState();

  // Validated ScreenMode Param
  const initialScreenMode = Object.values(ScreenMode).includes(screenModeParam as ScreenMode)
    ? (screenModeParam as ScreenMode)
    : ScreenMode.MonthPicker;

  const [currentScreenMode, setCurrentScreenMode] = useState<ScreenMode>(initialScreenMode);
  const [loading, setTransition] = useTransition();

  useEffect(() => {
    setScreenMode(initialScreenMode);
  }, [initialScreenMode, setScreenMode]);

  useEffect(() => {
    setTableState(loading ? TableState.Loading : TableState.Active);
  }, [loading, setTableState]);

  const handleScreenModeChange = useCallback(
    (value: string) => {
      const mode = value as ScreenMode;
      setTransition(() => {
        setScreenMode(mode);
        setCurrentScreenMode(mode);
        setSearchParam('screenMode', mode);
      });
    },
    [setScreenMode]
  );

  return (
    <SegmentedControl
      value={currentScreenMode}
      onChange={handleScreenModeChange}
      color="yellow"
      data={screenModes}
      autoContrast
    />
  );
}

export default memo(ScreenModeInput);
