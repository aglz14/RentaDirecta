import React from 'react';
import { Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="custom-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <Building className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">PropTech</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Iniciar Sesión
            </Button>
            <Button className="bg-[#00A86B] hover:bg-[#009060] text-white">
              Registrarse
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}