import { useState, useEffect } from 'react';
import { Building2, MapPin, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { AddBuildingDialog } from './AddBuildingDialog';

interface Building {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  total_units: number;
  occupied_units: number;
  total_area: number;
  occupied_area: number;
}

export function Buildings() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddBuildingOpen, setIsAddBuildingOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBuildings = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('building')
        .select(`
          id,
          name,
          street,
          exterior_number,
          interior_number,
          neighborhood,
          zip_code,
          city,
          state,
          country,
          properties (
            id,
            area,
            tenants!tenants_property_id_fkey (
              id
            )
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedBuildings = data.map(building => ({
        ...building,
        total_units: building.properties?.length || 0,
        occupied_units: building.properties?.filter(p => p.tenants?.length > 0).length || 0,
        total_area: building.properties?.reduce((sum, p) => sum + (p.area || 0), 0) || 0,
        occupied_area: building.properties?.filter(p => p.tenants?.length > 0)
          .reduce((sum, p) => sum + (p.area || 0), 0) || 0,
      }));

      setBuildings(processedBuildings);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los edificios. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, [user]);

  const filteredBuildings = buildings.filter(building => {
    const searchLower = searchTerm.toLowerCase();
    return (
      building.name.toLowerCase().includes(searchLower) ||
      building.address.toLowerCase().includes(searchLower) ||
      building.city.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar edificios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200 w-full"
          />
        </div>
        <Button 
          onClick={() => setIsAddBuildingOpen(true)}
          className="bg-[#1B2956] hover:bg-[#141d3d] text-white w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Inmueble
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Unidades</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {building.occupied_units}/{building.total_units}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Área (m²)</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {building.occupied_area}/{building.total_area}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-[#1B2956] text-[#1B2956] hover:bg-[#1B2956] hover:text-white"
                >
                  Ver Detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddBuildingDialog
        isOpen={isAddBuildingOpen}
        onClose={() => setIsAddBuildingOpen(false)}
        onSuccess={fetchBuildings}
      />
    </div>
  );
}