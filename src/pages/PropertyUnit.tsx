
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { PropertyUnitHeader } from '@/components/property-unit/PropertyUnitHeader';
import { PropertyUnitInfo } from '@/components/property-unit/PropertyUnitInfo';
import { PropertyUnitTenants } from '@/components/property-unit/PropertyUnitTenants';
import { PropertyUnitDocuments } from '@/components/property-unit/PropertyUnitDocuments';
import { PropertyUnitPayments } from '@/components/property-unit/PropertyUnitPayments';
import { PropertyUnitMaintenance } from '@/components/property-unit/PropertyUnitMaintenance';
import { BuildingDistribution } from '@/components/buildings/BuildingDistribution';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Property {
  id: string;
  name: string;
  monthly_rent: number;
  active: boolean;
  property_types: {
    name: string;
  };
  street: string;
  unit_number: string;
  neighborhood: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
  currency: string;
  owner: {
    first_name: string;
    last_name: string;
    email: string;
  };
  predial?: string | null;
}

interface Tenant {
  id: string;
  property_id: string;
  payment_scheme: 'subscription' | 'flex';
  last_payment_date: string | null;
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    whatsapp: string;
  } | null;
}

export default function PropertyUnit() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setIsLoading(true);
        const [propertyResponse, tenantsResponse] = await Promise.all([
          supabase
            .from('properties')
            .select(`
              *,
              property_types (name),
              owner:profiles!properties_owner_id_fkey (
                first_name,
                last_name,
                email
              ),
              buildings!properties_building_id_fkey (
                id,
                name
              )
            `)
            .eq('id', id)
            .single(),
          supabase
            .from('tenants')
            .select(`
              id,
              property_id,
              payment_scheme,
              last_payment_date,
              created_at,
              rent,
              currency,
              profile:profiles!tenants_profile_id_fkey (
                first_name,
                last_name,
                email,
                whatsapp,
                user_type
              ),
              property:properties!tenants_property_id_fkey (
                name,
                monthly_rent
              )
            `)
            .eq('property_id', id)
            .order('created_at', { ascending: false })
        ]);

        if (propertyResponse.error) throw propertyResponse.error;
        if (tenantsResponse.error) throw tenantsResponse.error;

        setProperty(propertyResponse.data);
        setTenants(tenantsResponse.data || []);
      } catch (error) {
        console.error('Error fetching property data:', error);
        toast({
          title: 'Error',
          description: 'No se pudo cargar la información de la propiedad.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPropertyData();
    }
  }, [id, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <DashboardNav />
      <ScrollArea className="flex-1">
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : property ? (
              <div className="grid gap-6 md:gap-8">
                <PropertyUnitHeader property={property} />
                <div className="grid md:grid-cols-2 gap-6">
                  <PropertyUnitInfo property={property} />
                  <BuildingDistribution />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <PropertyUnitTenants tenants={tenants} />
                  <PropertyUnitDocuments />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <PropertyUnitPayments />
                  <PropertyUnitMaintenance />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Propiedad no encontrada</h2>
                <p className="mt-2 text-gray-600">La propiedad que buscas no existe o no tienes acceso a ella.</p>
              </div>
            )}
          </div>
        </main>
      </ScrollArea>
      <Footer />
    </div>
  );
}
