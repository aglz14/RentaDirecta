import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { Tenants } from '@/components/dashboard/Tenants';
import { Settings } from '@/components/dashboard/Settings';

export default function Panel() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardNav />
      <main className="flex-1">
        <Routes>
          <Route index element={<DashboardContent />} />
          <Route path="inquilinos" element={<Tenants />} />
          <Route path="ajustes" element={<Settings />} />
          <Route path="*" element={<Navigate to="/panel" replace />} />
        </Routes>
      </main>
    </div>
  );
}