import { useState } from 'react';
import { Menu, X, Home, Building2, Package, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function DashboardNav() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/panel', icon: Home, label: 'Panel' },
    { path: '/administracion', icon: Building2, label: 'Unidades' },
    { path: '/mobiliario', icon: Package, label: 'Mobiliario' },
    { path: '/cuenta', icon: User, label: 'Cuenta' },
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center text-white hover:text-white hover:bg-white/20 transition-colors px-4 py-2 rounded-md ${
              isActive ? 'bg-white/20 font-medium' : ''
            }`
          }
          onClick={() => setIsOpen(false)}
        >
          <item.icon className="h-4 w-4 mr-2" />
          {item.label}
        </NavLink>
      ))}
    </>
  );

  return (
    <nav className="border-b bg-[#1B2956] shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-[#1B2956] p-0">
                <SheetHeader className="px-4 pt-4">
                  <SheetTitle className="text-white">Navegación</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-2 p-4">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <NavLinks />
          </div>
        </div>
      </div>
    </nav>
  );
}