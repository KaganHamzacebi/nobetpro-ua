import { ScreenMode } from '@/libs/enums/screen-mode';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { SegmentedControl } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { memo, useEffect } from 'react';

function ScreenModeInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const screenMode = useDutyStore.use.screenMode();
  const setScreenMode = useDutyStore.use.setScreenMode();

  useEffect(() => {
    const currentScreenMode = searchParams.get('mode');
    if (currentScreenMode !== screenMode) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('mode', screenMode);
      router.push(`?${newParams.toString()}`);
      console.log('xd');
    }
  }, [screenMode, searchParams, router]);

  const handleScreenModeChange = (mode: ScreenMode) => {
    setScreenMode(mode);
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
