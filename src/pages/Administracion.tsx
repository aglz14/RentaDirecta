import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { Units } from '@/components/dashboard/Units';
import { Tenants } from '@/components/dashboard/Tenants';
import { Payments } from '@/components/dashboard/Payments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Home, Users, Receipt } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Buildings } from '@/components/dashboard/Buildings';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Property {
  id: string;
  name: string;
  monthly_rent: number;
  active: boolean;
  property_type: {
    name: string;
  };
  property_type_id: string;
  building_id?: string;
  street: string;
  unit_number: string;
  neighborhood: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
}

export default function Administracion() {
  const [activeTab, setActiveTab] = useState('buildings');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const tabs = [
    { id: 'buildings', label: 'Inmuebles', icon: Building2 },
    { id: 'units', label: 'Unidades', icon: Home },
    { id: 'tenants', label: 'Inquilinos', icon: Users },
    { id: 'payments', label: 'Pagos', icon: Receipt },
  ];

  const fetchProperties = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          name,
          monthly_rent,
          active,
          property_type:property_type_id (
            name
          ),
          property_type_id,
          building_id,
          street,
          unit_number,
          neighborhood,
          zip_code,
          city,
          state,
          country
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
    if (activeTab === 'units') {
      setIsLoading(true);
      fetchProperties();
    }
  }, [activeTab, user]);

  const filteredProperties = properties.filter(property => {
    const searchLower = searchTerm.toLowerCase();
    return (
      property.name.toLowerCase().includes(searchLower) ||
      property.street.toLowerCase().includes(searchLower) ||
      property.property_type?.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <DashboardNav />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Administración</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
              <TabsList className="bg-white p-1 flex h-14 w-full">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex-1 flex items-center justify-center gap-2 px-4"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>

            <TabsContent value="buildings">
              <Buildings />
            </TabsContent>
            <TabsContent value="units">
              <Units 
                properties={filteredProperties} 
                isLoading={isLoading} 
                setSearchTerm={setSearchTerm}
              />
            </TabsContent>
            <TabsContent value="tenants">
              <Tenants />
            </TabsContent>
            <TabsContent value="payments">
              <Payments />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}