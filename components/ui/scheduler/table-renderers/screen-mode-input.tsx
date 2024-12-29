import { ScreenMode } from '@/libs/enums/screen-mode';
import { TableState } from '@/libs/enums/table-state';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { SegmentedControl } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { memo, useEffect, useTransition } from 'react';

function ScreenModeInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const screenMode = useDutyStore.use.screenMode();
  const setTableState = useDutyStore.use.setTableState();
  const setScreenMode = useDutyStore.use.setScreenMode();
  const [loading, setTransition] = useTransition();

  useEffect(() => {
    const currentScreenMode = searchParams.get('mode');
    if (currentScreenMode !== screenMode) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('mode', screenMode);
      router.replace(`?${params.toString()}`);
    }
  }, [screenMode, searchParams, router]);

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
