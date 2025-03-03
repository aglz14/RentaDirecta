import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const plans = [
  {
    id: 'basic',
    name: 'Plan Básico',
    price: '499',
    description: 'Ideal para propietarios que inician',
    features: [
      'Hasta 5 propiedades',
      'Gestión básica de inquilinos',
      'Reportes mensuales',
      'Soporte por correo',
    ],
  },
  {
    id: 'pro',
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
  },
  {
    id: 'enterprise',
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
  },
];

export function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  // Simulated current plan - in production, this would come from your backend
  const currentPlan = 'basic';

  const handlePlanChange = async (planId: string) => {
    setSelectedPlan(planId);
    setIsDialogOpen(true);
  };

  const confirmPlanChange = async () => {
    if (!selectedPlan) return;

    setIsLoading(true);
    try {
      // Here you would implement the actual plan change logic with your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call

      toast({
        title: 'Plan actualizado',
        description: 'Tu plan ha sido actualizado exitosamente.',
      });

      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el plan. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A86B]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Plan</h1>
        <p className="mt-2 text-gray-600">
          Administra tu suscripción y elige el plan que mejor se adapte a tus necesidades
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.id === currentPlan ? 'border-[#00A86B]' : ''}`}>
            {plan.id === currentPlan && (
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
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700">
                    <CheckCircle2 className="h-5 w-5 text-[#00A86B] mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.id === currentPlan
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-default'
                    : 'bg-[#00A86B] hover:bg-[#009060] text-white'
                }`}
                disabled={plan.id === currentPlan || isLoading}
                onClick={() => handlePlanChange(plan.id)}
              >
                {isLoading && selectedPlan === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : plan.id === currentPlan ? (
                  'Plan Actual'
                ) : (
                  'Cambiar Plan'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cambio de plan</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cambiar tu plan? Este cambio se reflejará en tu próxima factura.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmPlanChange}
              className="bg-[#00A86B] hover:bg-[#009060] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirmando...
                </>
              ) : (
                'Confirmar Cambio'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}