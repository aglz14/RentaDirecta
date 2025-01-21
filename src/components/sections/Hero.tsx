import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/auth/AuthDialog';

export function Hero() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#FEFEFE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative py-24 sm:py-32">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-[#323232] tracking-tight mb-8">
              Simplificamos la administración de{' '}
              <span className="text-gradient">rentas y propiedades</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-xl mx-auto">
              Gestiona propiedades y optimiza tus ingresos con un sistema diseñado para propietarios modernos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[#4CAF50] hover:bg-[#3d9140] text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setIsAuthOpen(true)}
              >
                Comenzar Ahora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white text-[#323232] hover:text-white hover:bg-[#1B2956] border-2 border-[#1B2956] px-8 py-6 text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Ver Demo
              </Button>
            </div>
          </div>

          {/* Subtle decorative elements */}
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#4CAF50] opacity-[0.03] rounded-full blur-3xl" />
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#1B2956] opacity-[0.03] rounded-full blur-3xl" />
        </div>
      </div>

      <AuthDialog 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        defaultTab="signup"
      />
    </section>
  );
}