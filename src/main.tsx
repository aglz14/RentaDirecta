import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import App from './App.tsx';
import Panel from './pages/Panel.tsx';
import TermsAndConditions from './pages/TermsAndConditions.tsx';
import PrivacyPolicy from './pages/PrivacyPolicy.tsx';
import CookiesPolicy from './pages/CookiesPolicy.tsx';
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);