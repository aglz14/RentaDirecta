import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AuthDialog } from '@/components/auth/AuthDialog';

const plans = [
  {
    name: 'Plan Básico',
    description: 'Ideal para propietarios con 4 o menos propiedades',
    price: '499',
    features: [
      'Hasta 4 propiedades',
      'Gestión básica de inquilinos',
      'Cobros automáticos',
      'Reportes mensuales',
      'Soporte por correo',
      'Panel de control personalizado',
    ],
    highlight: false,
  },
  {
    name: 'Plan Profesional',
    description: 'Perfecto para propietarios con 5 a 10 propiedades',
    price: '999',
    features: [
      'Hasta 10 propiedades',
      'Gestión avanzada de inquilinos',
      'Cobros automáticos',
      'Reportes semanales',
      'Soporte prioritario',
      'Panel de control personalizado',
      'Análisis de mercado',
      'Notificaciones en tiempo real',
    ],
    highlight: true,
  },
  {
    name: 'Plan Empresarial',
    description: 'Para propietarios con más de 10 propiedades',
    price: '1,999',
    features: [
      'Propiedades ilimitadas',
      'Gestión avanzada de inquilinos',
      'Cobros automáticos',
      'Reportes en tiempo real',
      'Soporte 24/7',
      'Panel de control personalizado',
      'Análisis avanzado de mercado',
      'Notificaciones en tiempo real',
      'API personalizada',
      'Gestor de documentos',
    ],
    highlight: false,
  },
];

export function PricingTable() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <section className="py-24 bg-gray-50" id="pricing-table">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-lg font-bold text-[#4CAF50] mb-4">PLANES</h2>
          <h2 className="text-4xl font-bold text-[#323232] mb-4">Elige el Plan Perfecto para Ti</h2>
          <p className="text-xl text-gray-600">
            Soluciones adaptadas a diferentes tamaños de portafolios inmobiliarios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 ${
                plan.highlight ? 'border-2 border-[#4CAF50]' : ''
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#4CAF50] text-white px-4 py-1 rounded-full text-sm">
                    Más Popular
                  </span>
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#323232] mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#323232]">${plan.price}</span>
                  <span className="text-gray-600">/mes</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <Check className="h-5 w-5 text-[#4CAF50] mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => setIsAuthOpen(true)}
                  className={`w-full ${
                    plan.highlight
                      ? 'bg-[#4CAF50] hover:bg-[#3d9140] text-white'
                      : 'bg-white text-[#4CAF50] border-2 border-[#4CAF50] hover:bg-[#4CAF50] hover:text-white'
                  }`}
                >
                  Comenzar Ahora
                </Button>
              </div>
            </div>
          ))}
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