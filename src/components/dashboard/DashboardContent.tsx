import { Button } from '@/components/ui/button';
import { PropertyCard } from './property-card';
import { PaymentSummary } from './payment-summary';

const mockProperty = {
  id: '1',
  name: 'Departamentos Sunset 3B',
  address: 'Calle Principal 123, CDMX',
  monthlyRent: 12000,
  paymentScheme: 'subscription' as const,
  active: true,
  tenantId: 'tenant-1',
};

export function DashboardContent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel Principal</h1>
        <Button className="bg-[#00A86B] hover:bg-[#009060] text-white">
          Agregar Propiedad
        </Button>
      </div>

      <PaymentSummary />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Tus Propiedades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PropertyCard property={mockProperty} />
          <PropertyCard property={{...mockProperty, id: '2', paymentScheme: 'flex', name: 'Loft Centro 5A'}} />
          <PropertyCard property={{...mockProperty, id: '3', name: 'Vista Jardín 2C', active: false, tenantId: undefined}} />
        </div>
      </div>
    </div>
  );
}