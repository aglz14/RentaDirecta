import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const plans = [
  {
    name: 'Plan Básico',
    price: '499',
    description: 'Ideal para propietarios que inician',
    features: [
      'Hasta 5 propiedades',
      'Gestión básica de inquilinos',
      'Reportes mensuales',
      'Soporte por correo',
    ],
    current: true,
  },
  {
    name: 'Plan Profesional',
    price: '999',
    description: 'Para propietarios con múltiples propiedades',
    features: [
      'Hasta 15 propiedades',
      'Gestión avanzada de inquilinos',
      'Reportes semanales',
      'Soporte prioritario',
      'Análisis de mercado',
    ],
    current: false,
  },
  {
    name: 'Plan Empresarial',
    price: '1,999',
    description: 'Solución completa para empresas inmobiliarias',
    features: [
      'Propiedades ilimitadas',
      'Gestión completa de inquilinos',
      'Reportes en tiempo real',
      'Soporte 24/7',
      'Análisis avanzado de mercado',
      'API personalizada',
    ],
    current: false,
  },
];

export function Settings() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración de Plan</h1>
        <p className="mt-2 text-gray-600">
          Elige el plan que mejor se adapte a tus necesidades
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.current ? 'border-[#00A86B]' : ''}`}>
            {plan.current && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#00A86B] text-white px-4 py-1 rounded-full text-sm">
                  Plan Actual
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-600">/mes</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700">
                    <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full mt-6 ${
                  plan.current
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-default'
                    : 'bg-[#00A86B] hover:bg-[#009060] text-white'
                }`}
                disabled={plan.current}
              >
                {plan.current ? 'Plan Actual' : 'Cambiar Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}