import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from './property-card';
import { PaymentSummary } from './payment-summary';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { AddPropertyDialog } from './AddPropertyDialog';

interface Property {
  id: string;
  name: string;
  address: string;
  monthly_rent: number;
  payment_scheme: 'subscription' | 'flex';
  active: boolean;
  tenants: {
    id: string;
    profile_id: string;
  }[] | null;
}

export function DashboardContent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProperties = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          name,
          address,
          monthly_rent,
          payment_scheme,
          active,
          tenants (
            id,
            profile_id
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las propiedades. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A86B]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel Principal</h1>
        <Button 
          className="bg-[#00A86B] hover:bg-[#009060] text-white"
          onClick={() => setIsAddPropertyOpen(true)}
        >
          Agregar Propiedad
        </Button>
      </div>

      <PaymentSummary />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Tus Propiedades</h2>
        {properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">
              No tienes propiedades registradas. ¡Comienza agregando una!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={{
                  id: property.id,
                  name: property.name,
                  address: property.address,
                  monthlyRent: property.monthly_rent,
                  paymentScheme: property.payment_scheme,
                  active: property.active,
                  tenantId: property.tenants?.[0]?.profile_id,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <AddPropertyDialog
        isOpen={isAddPropertyOpen}
        onClose={() => setIsAddPropertyOpen(false)}
        onSuccess={fetchProperties}
      />
    </div>
  );
}