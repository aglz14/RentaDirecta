import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-[#323232] mb-6">
            Simplificamos la administración de rentas y propiedades
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Gestiona propiedades y optimiza tus ingresos con un sistema diseñado para propietarios modernos.
          </p>
          <div className="flex justify-center space-x-6">
            <Button size="lg" className="bg-[#00A86B] hover:bg-[#009060] text-white px-8 py-6 text-lg">
              Comenzar Ahora <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-[#323232] hover:text-white hover:bg-[#323232] border-2 border-[#323232] px-8 py-6 text-lg transition-colors"
            >
              Ver Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}