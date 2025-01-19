import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import { AppRoutes } from './routes';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found. Make sure there is a div with id "root" in your HTML.');
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);