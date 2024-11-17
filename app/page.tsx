import Login from '@/components/ui/login';
import { Skeleton } from '@mantine/core';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="mt-20 flex h-full w-full items-center justify-center">
      <Suspense fallback={<Skeleton />}>
        <Login />
      </Suspense>
    </div>
  );
}
