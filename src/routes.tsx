import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import App from './App';
import Panel from './pages/Panel';
import Administracion from './pages/Administracion';
import Mobiliario from './pages/Mobiliario';
import Cuenta from './pages/Cuenta';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiesPolicy from './pages/CookiesPolicy';
import BuildingDetails from './pages/BuildingDetails';
import { useAuth } from '@/contexts/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4CAF50]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route 
        path="/panel" 
        element={
          <ProtectedRoute>
            <Panel />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardContent />} />
      </Route>
      <Route
        path="/administracion"
        element={
          <ProtectedRoute>
            <Administracion />
          </ProtectedRoute>
        }
      />
      <Route
        path="/administracion/inmueble/:id"
        element={
          <ProtectedRoute>
            <BuildingDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mobiliario"
        element={
          <ProtectedRoute>
            <Mobiliario />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cuenta"
        element={
          <ProtectedRoute>
            <Cuenta />
          </ProtectedRoute>
        }
      />
      <Route path="/terminos" element={<TermsAndConditions />} />
      <Route path="/privacidad" element={<PrivacyPolicy />} />
      <Route path="/cookies" element={<CookiesPolicy />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}