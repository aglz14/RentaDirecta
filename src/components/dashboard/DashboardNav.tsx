import { Home, CreditCard, Users, User, Building2, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink, useLocation } from 'react-router-dom';

export function DashboardNav() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="border-b bg-[#1B2956] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <NavLink 
              to="/panel"
              className={({ isActive }) =>
                `flex items-center text-white hover:text-white hover:bg-white/20 transition-colors px-4 py-2 rounded-md ${
                  isActive ? 'bg-white/20 font-medium' : ''
                }`
              }
            >
              <Home className="h-4 w-4 mr-2" />
              Panel
            </NavLink>
            <NavLink 
              to="/panel/propiedades"
              className={({ isActive }) =>
                `flex items-center text-white hover:text-white hover:bg-white/20 transition-colors px-4 py-2 rounded-md ${
                  isActive ? 'bg-white/20 font-medium' : ''
                }`
              }
            >
              <Building2 className="h-4 w-4 mr-2" />
              Propiedades
            </NavLink>
            <NavLink 
              to="/panel/pagos"
              className={({ isActive }) =>
                `flex items-center text-white hover:text-white hover:bg-white/20 transition-colors px-4 py-2 rounded-md ${
                  isActive ? 'bg-white/20 font-medium' : ''
                }`
              }
            >
              <Receipt className="h-4 w-4 mr-2" />
              Pagos
            </NavLink>
            <NavLink 
              to="/panel/inquilinos"
              className={({ isActive }) =>
                `flex items-center text-white hover:text-white hover:bg-white/20 transition-colors px-4 py-2 rounded-md ${
                  isActive ? 'bg-white/20 font-medium' : ''
                }`
              }
            >
              <Users className="h-4 w-4 mr-2" />
              Inquilinos
            </NavLink>
            <NavLink 
              to="/panel/planes"
              className={({ isActive }) =>
                `flex items-center text-white hover:text-white hover:bg-white/20 transition-colors px-4 py-2 rounded-md ${
                  isActive ? 'bg-white/20 font-medium' : ''
                }`
              }
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Planes
            </NavLink>
            <NavLink 
              to="/panel/cuenta"
              className={({ isActive }) =>
                `flex items-center text-white hover:text-white hover:bg-white/20 transition-colors px-4 py-2 rounded-md ${
                  isActive ? 'bg-white/20 font-medium' : ''
                }`
              }
            >
              <User className="h-4 w-4 mr-2" />
              Cuenta
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}