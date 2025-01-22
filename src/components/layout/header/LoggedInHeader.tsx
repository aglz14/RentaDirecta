import { User2, LogOut, LayoutDashboard, Home, CreditCard, UserCog, Building2, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

export function LoggedInHeader() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente.',
      });
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cerrar sesión. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getDisplayName = () => {
    if (profile?.first_name && profile.first_name.trim() !== '') {
      return profile.first_name;
    }
    
    if (profile?.last_name && profile.last_name.trim() !== '') {
      return profile.last_name;
    }
    
    if (profile?.email) {
      const emailName = profile.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    const emailName = user?.email?.split('@')[0] || '';
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };

  const getFullName = () => {
    if (profile?.first_name || profile?.last_name) {
      const firstName = profile.first_name?.trim() || '';
      const lastName = profile.last_name?.trim() || '';
      return [firstName, lastName].filter(Boolean).join(' ');
    }
    return getDisplayName();
  };

  return (
    <header className="custom-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-4 hover:opacity-90 transition-opacity">
            <div className="w-60 h-15 flex-shrink-0">
              <img 
                src="https://kgepsmcikgxoqjzhjxwq.supabase.co/storage/v1/object/public/logos/WhatsApp%20Image%202025-01-16%20at%2019.19.36%20(2).jpeg" 
                alt="RentaDirecta Logo" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-300 hover:text-white flex items-center space-x-2">
                  <User2 className="h-5 w-5" />
                  <span>{getDisplayName()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-white rounded-md shadow-lg border border-gray-200"
              >
                <DropdownMenuLabel className="font-semibold text-gray-900 px-3 py-2">
                  {getFullName()}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem 
                  onClick={() => handleNavigation('/panel')}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Panel
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleNavigation('/panel/propiedades')}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Propiedades
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleNavigation('/panel/pagos')}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Pagos
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleNavigation('/panel/inquilinos')}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Inquilinos
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleNavigation('/panel/planes')}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Planes
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleNavigation('/panel/cuenta')}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                >
                  <UserCog className="h-4 w-4 mr-2" />
                  Cuenta
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 cursor-pointer flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}