import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      <Sidebar />
      <div className="lg:pl-64">
        <main className="pt-16 lg:pt-0 p-3 sm:p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

