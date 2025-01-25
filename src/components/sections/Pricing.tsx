import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Pricing() {
  return (
    <section className="py-24 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-lg font-bold text-[#4CAF50] mb-4">PROXIMAMENTE</h2>
          <h2 className="text-4xl font-bold text-[#323232] mb-4">Cobra tus Rentas</h2>
          <p className="text-xl text-gray-600">Recibe tus rentas puntualmente y optimiza tus ingresos. Los inquilinos eligen su esquema por propiedad.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl custom-shadow payment-option">
            <h3 className="text-2xl font-bold text-[#323232] mb-4">Renta Quincenal</h3>
            <p className="text-gray-600 mb-6">Cobros automáticos quincenales</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Descuento del 5% en la renta
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Cobros automáticos
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Se requiere tarjeta de crédito
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Cobros por suscripción
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Recibe tus rentas sin retrasos
              </li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-xl custom-shadow payment-option">
            <h3 className="text-2xl font-bold text-[#323232] mb-4">Renta Mensual</h3>
            <p className="text-gray-600 mb-6">Cobros automáticos mensuales</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Descuento del 3% en la renta
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Cobros automáticos
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Se requiere tarjeta de crédito 
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Cobros por suscripción
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Recibe tus rentas sin retrasos
              </li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-xl custom-shadow payment-option">
            <h3 className="text-2xl font-bold text-[#323232] mb-4">Renta Flex</h3>
            <p className="text-gray-600 mb-6">Flexibilidad en métodos y fechas de pago</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Múltiples métodos de pago
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Pagos en efectivo disponibles
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Fechas flexibles
              </li> 
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Renta con base en fecha de pago
              </li> 
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                Recordatorios personalizados
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
