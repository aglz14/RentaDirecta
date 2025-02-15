import { useParams, useNavigate } from 'react-router-dom';
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
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

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
  owner_name: string;
  owner_email: string;
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

        // Fetch property data
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select(`
            *,
            property_types (
              name
            )
          `)
          .eq('id', id)
          .single();

        if (propertyError) throw propertyError;
        setProperty(propertyData);

        // Fetch tenants data for this property
        const { data: tenantsData, error: tenantsError } = await supabase
          .from('tenants')
          .select(`
            id,
            property_id,
            payment_scheme,
            last_payment_date,
            created_at,
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
          .order('created_at', { ascending: false });

        if (tenantsError) throw tenantsError;
        setTenants(tenantsData || []);
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

  if (!property && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <DashboardNav />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Propiedad no encontrada</h2>
              <p className="mt-2 text-gray-600">La propiedad que buscas no existe o no tienes acceso a ella.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <DashboardNav />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <PropertyUnitHeader property={property} />
            <PropertyUnitInfo property={property} />
            <PropertyUnitTenants tenants={tenants} />
            <PropertyUnitDocuments />
            <PropertyUnitPayments />
            <PropertyUnitMaintenance />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}