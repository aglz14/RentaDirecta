import { Building, Home, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/dashboard/property-card';
import { PaymentSummary } from '@/components/dashboard/payment-summary';

const mockProperty = {
  id: '1',
  name: 'Departamentos Sunset 3B',
  address: 'Calle Principal 123, CDMX',
  monthlyRent: 12000,
  paymentScheme: 'subscription' as const,
  active: true,
  tenantId: 'tenant-1',
};

function Panel() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">PropTech</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="flex items-center text-white hover:bg-white/10">
                <Home className="h-4 w-4 mr-2" />
                Panel
              </Button>
              <Button variant="ghost" className="flex items-center text-white hover:bg-white/10">
                <Users className="h-4 w-4 mr-2" />
                Inquilinos
              </Button>
              <Button variant="ghost" className="flex items-center text-white hover:bg-white/10">
                <Settings className="h-4 w-4 mr-2" />
                Ajustes
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Panel Principal</h1>
          <Button>Agregar Propiedad</Button>
        </div>

        {/* Summary Cards */}
        <PaymentSummary />

        {/* Properties Grid */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Tus Propiedades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PropertyCard property={mockProperty} />
            <PropertyCard property={{...mockProperty, id: '2', paymentScheme: 'flex', name: 'Loft Centro 5A'}} />
            <PropertyCard property={{...mockProperty, id: '3', name: 'Vista Jardín 2C', active: false, tenantId: undefined}} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Panel;