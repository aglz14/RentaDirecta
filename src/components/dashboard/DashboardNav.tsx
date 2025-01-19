import { Home, CreditCard, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

export function DashboardNav() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="border-b bg-[#00A86B] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className={`flex items-center text-white hover:text-white hover:bg-white/20 transition-colors ${
                isActive('/panel') ? 'bg-white/20 font-medium' : ''
              }`}
              asChild
            >
              <Link to="/panel">
                <Home className="h-4 w-4 mr-2" />
                Panel
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex items-center text-white hover:text-white hover:bg-white/20 transition-colors ${
                isActive('/panel/inquilinos') ? 'bg-white/20 font-medium' : ''
              }`}
              asChild
            >
              <Link to="/panel/inquilinos">
                <Users className="h-4 w-4 mr-2" />
                Inquilinos
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex items-center text-white hover:text-white hover:bg-white/20 transition-colors ${
                isActive('/panel/planes') ? 'bg-white/20 font-medium' : ''
              }`}
              asChild
            >
              <Link to="/panel/planes">
                <CreditCard className="h-4 w-4 mr-2" />
                Planes
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex items-center text-white hover:text-white hover:bg-white/20 transition-colors ${
                isActive('/panel/cuenta') ? 'bg-white/20 font-medium' : ''
              }`}
              asChild
            >
              <Link to="/panel/cuenta">
                <User className="h-4 w-4 mr-2" />
                Cuenta
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}