'use client';

import { ScreenMode } from '@/libs/enums/screen-mode';
import { useDutyStore } from '@/libs/stores/use-duty-store';
import { Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';

export default function NewDutyButton() {
  const router = useRouter();
  const [loading, setTransition] = useTransition();
  const initDuty = useDutyStore.use.initDuty();

  useEffect(() => {
    router.prefetch(`/dashboard/duty-list/new`);
  }, []);

  const handleNewDuty = () => {
    setTransition(() => {
      initDuty([], []);
      router.push(`/dashboard/duty-list/new?mode=${ScreenMode.MonthPicker}`);
    });
  };

  return (
    <Button
      className="fixed bottom-4 right-4"
      size="lg"
      loading={loading}
      variant="default"
      onClick={handleNewDuty}>
      New Duty
    </Button>
  );
}
