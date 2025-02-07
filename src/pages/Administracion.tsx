import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { PropertyCard } from '@/components/dashboard/property-card';
import { Tenants } from '@/components/dashboard/Tenants';
import { Payments } from '@/components/dashboard/Payments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, FileText, Receipt, Wrench, Plus, Search, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddPropertyDialog } from '@/components/dashboard/AddPropertyDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

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

export default function Administracion() {
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const tabs = [
    { id: 'properties', label: 'Propiedades', icon: Building2 },
    { id: 'tenants', label: 'Inquilinos', icon: Users },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'payments', label: 'Pagos', icon: Receipt },
    { id: 'services', label: 'Servicios', icon: Wrench },
  ];

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
    if (activeTab === 'properties') {
      setIsLoading(true);
      fetchProperties();
    }
  }, [activeTab, user]);

  const filteredProperties = properties.filter(property => {
    const searchLower = searchTerm.toLowerCase();
    return (
      property.name.toLowerCase().includes(searchLower) ||
      property.address.toLowerCase().includes(searchLower) ||
      property.property_type?.name.toLowerCase().includes(searchLower)
    );
  });

  const PropertiesContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#4CAF50]" />
        </div>
      );
    }

    if (properties.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">
            No tienes propiedades registradas.
          </p>
          <Button 
            onClick={() => setIsAddPropertyOpen(true)}
            className="bg-[#4CAF50] hover:bg-[#3d9140] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Propiedad
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar propiedades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200 w-full"
            />
          </div>
          <Button 
            onClick={() => setIsAddPropertyOpen(true)}
            className="bg-[#4CAF50] hover:bg-[#3d9140] text-white w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Propiedad
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    );
  };

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

            <TabsContent value="properties">
              <PropertiesContent />
            </TabsContent>
            <TabsContent value="tenants">
              <Tenants />
            </TabsContent>
            <TabsContent value="documents">
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Documentos Legales</h2>
                {/* Add document management UI here */}
              </div>
            </TabsContent>
            <TabsContent value="payments">
              <Payments />
            </TabsContent>
            <TabsContent value="services">
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Servicios y Mantenimiento</h2>
                {/* Add services management UI here */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      <AddPropertyDialog
        isOpen={isAddPropertyOpen}
        onClose={() => setIsAddPropertyOpen(false)}
        onSuccess={fetchProperties}
      />
    </div>
  );
}