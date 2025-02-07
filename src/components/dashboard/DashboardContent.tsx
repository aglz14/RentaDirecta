import { useState, useEffect } from 'react';
import { PropertyCard } from './property-card';
import { PaymentSummary } from './payment-summary';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  address: string;
  monthly_rent: number;
  active: boolean;
  property_type: {
    name: string;
  };
  property_type_id: string;
  building_id?: string;
}

export function DashboardContent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
          active,
          property_type:property_type_id (
            name
          ),
          property_type_id,
          building_id
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
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
  }, [user]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Panel Principal</h1>

      <PaymentSummary />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Tus Propiedades</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#4CAF50]" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">
              No tienes propiedades registradas. Dirígete a la sección de Administración para agregar una propiedad.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}