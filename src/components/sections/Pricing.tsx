import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Pricing() {
  return (
    <section className="py-24 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-lg font-bold text-[#4CAF50] mb-4">INQUILINOS</h2>
          <h2 className="text-4xl font-bold text-[#323232] mb-4">Planes Disponibles</h2>
          <p className="text-xl text-gray-600">Elige el plan que mejor se adapte a tus inquilinos</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl custom-shadow payment-option">
            <h3 className="text-2xl font-bold text-[#323232] mb-4">Suscripción por Quincena</h3>
            <p className="text-gray-600 mb-6">Pago automático quincenal con 5% de descuento</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Descuento del 5% en la renta
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Pagos automáticos
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Sólo se requiere tarjeta de crédito
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Sin cargos adicionales
              </li>
            </ul>
            <Button className="w-full bg-[#00A86B] hover:bg-[#009060] text-white">
              Seleccionar Plan
            </Button>
          </div>
          <div className="bg-white p-8 rounded-xl custom-shadow payment-option">
            <h3 className="text-2xl font-bold text-[#323232] mb-4">Pagos Flex</h3>
            <p className="text-gray-600 mb-6">Flexibilidad en métodos y fechas de pago</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Múltiples métodos de pago
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Fechas flexibles
              </li> 
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Renta basada en la fecha de pago
              </li> 
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Recordatorios personalizados
              </li>
            </ul>
            <Button className="w-full bg-[#00A86B] hover:bg-[#009060] text-white">
              Seleccionar Plan
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}