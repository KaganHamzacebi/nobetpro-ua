import DashboardNavbar from '@/components/ui/navbar/dashboard-navbar';
import { Metadata } from 'next';
import { ReactNode } from 'react';

interface IDashboardLayout {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: 'Dashboard'
};

export default function DashboardLayout({ children }: Readonly<IDashboardLayout>) {
  return (
    <>
      <DashboardNavbar />
      {children}
    </>
  );
}
