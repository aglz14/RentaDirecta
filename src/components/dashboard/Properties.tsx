import { useState, useEffect } from 'react';
import { Building2, MapPin, CreditCard, Users, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { AddPropertyDialog } from './AddPropertyDialog';
import { AddBuildingDialog } from './AddBuildingDialog';

interface Property {
  id: string;
  name: string;
  address: string;
  monthly_rent: number;
  payment_scheme: 'subscription' | 'flex';
  active: boolean;
  tenant_count: number;
  total_income: number;
  next_payment_date: string | null;
}

interface Building {
  id: string;
  name: string;
  address: string;
}

export function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [isAddBuildingOpen, setIsAddBuildingOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      if (!user) return;

      // Fetch buildings
      const { data: buildingsData, error: buildingsError } = await supabase
        .from('building')
        .select('id, name, address')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (buildingsError) throw buildingsError;
      setBuildings(buildingsData || []);

      // Fetch properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          id,
          name,
          address,
          monthly_rent,
          payment_scheme,
          active,
          tenants!tenants_property_id_fkey (
            id,
            payments (
              amount,
              date
            )
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      const processedProperties = propertiesData.map(property => ({
        ...property,
        tenant_count: property.tenants?.length || 0,
        total_income: property.tenants?.reduce((sum, tenant) => 
          sum + (tenant.payments?.reduce((pSum, payment) => pSum + payment.amount, 0) || 0), 0
        ) || 0,
        next_payment_date: property.tenants?.[0]?.payments?.[0]?.date || null,
      }));

      setProperties(processedProperties);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const filteredProperties = properties.filter(property => {
    const searchLower = searchTerm.toLowerCase();
    return (
      property.name.toLowerCase().includes(searchLower) ||
      property.address.toLowerCase().includes(searchLower)
    );
  });

  const filteredBuildings = buildings.filter(building => {
    const searchLower = searchTerm.toLowerCase();
    return (
      building.name.toLowerCase().includes(searchLower) ||
      building.address.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-12">
      {/* Search Bar */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white border-gray-200 w-full"
        />
      </div>

      {/* Buildings Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edificios</h2>
          <Button 
            onClick={() => setIsAddBuildingOpen(true)}
            className="bg-[#1B2956] hover:bg-[#141d3d] text-white"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Agregar Edificio
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuildings.map((building) => (
            <Card key={building.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">{building.name}</CardTitle>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{building.address}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-[#1B2956] text-[#1B2956] hover:bg-[#1B2956] hover:text-white"
                >
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Individual Properties Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Propiedades Individuales</h2>
          <Button 
            onClick={() => setIsAddPropertyOpen(true)}
            className="bg-[#4CAF50] hover:bg-[#3d9140] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Propiedad
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">{property.name}</CardTitle>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.address}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    property.payment_scheme === 'subscription' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }>
                    {property.payment_scheme === 'subscription' ? 'Suscripción' : 'Flex'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 text-[#4CAF50] mr-2" />
                      <span className="text-sm text-gray-700">
                        Estado: {property.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-[#4CAF50] mr-2" />
                      <span className="text-sm text-gray-700">
                        {property.tenant_count} Inquilinos
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-[#4CAF50] mr-2" />
                      <span className="text-sm text-gray-700">
                        ${property.monthly_rent.toLocaleString('es-MX')}/mes
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700">
                        Total: ${property.total_income.toLocaleString('es-MX')}
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
                  >
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <AddPropertyDialog
        isOpen={isAddPropertyOpen}
        onClose={() => setIsAddPropertyOpen(false)}
        onSuccess={fetchData}
      />

      <AddBuildingDialog
        isOpen={isAddBuildingOpen}
        onClose={() => setIsAddBuildingOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}