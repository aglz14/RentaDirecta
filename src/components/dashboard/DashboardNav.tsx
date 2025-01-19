import { Home, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

export function DashboardNav() {
  const location = useLocation();
  
  return (
    <nav className="border-b bg-[#00A86B] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="flex items-center text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              asChild
            >
              <Link to="/panel">
                <Home className="h-4 w-4 mr-2" />
                Panel
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              className="flex items-center text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              asChild
            >
              <Link to="/panel/inquilinos">
                <Users className="h-4 w-4 mr-2" />
                Inquilinos
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              className="flex items-center text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              asChild
            >
              <Link to="/panel/ajustes">
                <Settings className="h-4 w-4 mr-2" />
                Ajustes
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}