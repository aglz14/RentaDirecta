import React, { useState } from 'react';
import { Building, User2, LogOut, LayoutDashboard, Home, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { AuthDialog } from '@/components/auth/AuthDialog';
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

export function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthClick = (type: 'login' | 'signup') => {
    setAuthType(type);
    setIsAuthOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente.',
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cerrar sesión. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="custom-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <Building className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">PropTech</span>
          </Link>
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-white"
                  onClick={() => handleAuthClick('login')}
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  className="bg-[#00A86B] hover:bg-[#009060] text-white"
                  onClick={() => handleAuthClick('signup')}
                >
                  Registrarse
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-300 hover:text-white flex items-center space-x-2">
                    <User2 className="h-5 w-5" />
                    <span>{profile?.full_name || profile?.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-white rounded-md shadow-lg border border-gray-200"
                >
                  <DropdownMenuLabel className="font-semibold text-gray-900 px-3 py-2">
                    Mi Cuenta
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem 
                    onClick={() => navigate('/panel')}
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Panel
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/panel/inquilinos')}
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Inquilinos
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/panel/ajustes')}
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
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
            )}
          </div>
        </div>
      </div>
      <AuthDialog 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        defaultTab={authType}
      />
    </header>
  );
}