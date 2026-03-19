import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useStore } from '../store/useStore';

export function ProtectedLayout() {
  const currentUser = useStore((state) => state.currentUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-grid bg-[size:24px_24px] px-4 py-4 md:px-5">
      <div className="mx-auto flex max-w-[1700px] gap-4">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-[calc(100vh-2rem)] flex-1 flex-col gap-4">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 pb-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
