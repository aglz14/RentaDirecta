import { useState, useEffect } from 'react';
import { Building2, MapPin, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { AddBuildingDialog } from './AddBuildingDialog';
import { useNavigate } from 'react-router-dom';

interface Building {
  id: string;
  name: string;
  street: string;
  exterior_number: string;
  interior_number: string | null;
  neighborhood: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
}

export function Buildings() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddBuildingOpen, setIsAddBuildingOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchBuildings = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('buildings')
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
          country
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBuildings(data || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los inmuebles. Por favor, intenta de nuevo.',
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
      building.street.toLowerCase().includes(searchLower) ||
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
            placeholder="Buscar inmuebles..."
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
          <Card 
            key={building.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/administracion/inmueble/${building.id}`)}
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">{building.name}</CardTitle>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {building.street} {building.exterior_number}
                      {building.interior_number ? `, Int. ${building.interior_number}` : ''}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <p className="text-sm text-gray-600">{building.neighborhood}</p>
                  <p className="text-sm text-gray-600">{building.zip_code}</p>
                  <p className="text-sm text-gray-600">{building.city}, {building.state}</p>
                  <p className="text-sm text-gray-600">{building.country}</p>
                </div>
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