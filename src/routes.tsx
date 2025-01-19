import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import App from './App';
import Panel from './pages/Panel';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { Tenants } from '@/components/dashboard/Tenants';
import { Planes } from '@/components/dashboard/Planes';
import { Account } from '@/components/dashboard/Account';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiesPolicy from './pages/CookiesPolicy';
import { useAuth } from '@/contexts/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A86B]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/panel" element={<ProtectedRoute><Panel /></ProtectedRoute>}>
        <Route index element={<DashboardContent />} />
        <Route path="inquilinos" element={<Tenants />} />
        <Route path="planes" element={<Planes />} />
        <Route path="cuenta" element={<Account />} />
      </Route>
      <Route path="/terminos" element={<TermsAndConditions />} />
      <Route path="/privacidad" element={<PrivacyPolicy />} />
      <Route path="/cookies" element={<CookiesPolicy />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}