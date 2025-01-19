import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import App from './App';
import Panel from './pages/Panel';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiesPolicy from './pages/CookiesPolicy';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/panel/*',
    element: <Panel />,
  },
  {
    path: '/terminos',
    element: <TermsAndConditions />,
  },
  {
    path: '/privacidad',
    element: <PrivacyPolicy />,
  },
  {
    path: '/cookies',
    element: <CookiesPolicy />,
  },
]);

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found. Make sure there is a div with id "root" in your HTML.');
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  </StrictMode>
);