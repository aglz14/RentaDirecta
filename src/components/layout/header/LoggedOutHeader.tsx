import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { useState } from 'react';

export function LoggedOutHeader() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');

  const handleAuthClick = (type: 'login' | 'signup') => {
    setAuthType(type);
    setIsAuthOpen(true);
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