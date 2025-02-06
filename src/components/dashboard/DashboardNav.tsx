import { Home, CreditCard, Users, User, Building2, Receipt, FileText, Wrench, Package, Warehouse, UserPlus, FileInput as FileInvoice } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

export function DashboardNav() {
  const location = useLocation();
  
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
              to="/administracion"
              className={({ isActive }) =>
                `flex items-center text-white hover:text-white hover:bg-white/20 transition-colors px-4 py-2 rounded-md ${
                  isActive ? 'bg-white/20 font-medium' : ''
                }`
              }
            >
              <Building2 className="h-4 w-4 mr-2" />
              Administración
            </NavLink>
            <NavLink 
              to="/mobiliario"
              className={({ isActive }) =>
                `flex items-center text-white hover:text-white hover:bg-white/20 transition-colors px-4 py-2 rounded-md ${
                  isActive ? 'bg-white/20 font-medium' : ''
                }`
              }
            >
              <Package className="h-4 w-4 mr-2" />
              Mobiliario
            </NavLink>
            <NavLink 
              to="/cuenta"
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