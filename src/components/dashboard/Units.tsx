
import { useState, useEffect } from 'react';
import { Building2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Unit {
  id: string;
  name: string;
  monthly_rent: number;
  payment_scheme: 'subscription' | 'flex';
  active: boolean;
  building?: {
    id: string;
    name: string;
  };
  property_type?: {
    id: string;
    name: string;
  };
}

export function Units() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUnits = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          name,
          monthly_rent,
          payment_scheme,
          active,
          building:building_id (
            id,
            name
          ),
          property_type:property_type_id (
            id,
            name
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUnits(data);
    } catch (error) {
      console.error('Error fetching units:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las unidades. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [user]);

  const filteredUnits = units.filter(unit => {
    const searchLower = searchTerm.toLowerCase();
    return (
      unit.name.toLowerCase().includes(searchLower) ||
      unit.building?.name.toLowerCase().includes(searchLower) ||
      unit.property_type?.name.toLowerCase().includes(searchLower)
    );
  });

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar unidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200 w-full"
          />
        </div>
        <Button 
          className="bg-[#1B2956] hover:bg-[#141d3d] text-white w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Unidad
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnits.map((unit) => (
          <Card key={unit.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">{unit.name}</CardTitle>
                  {unit.building && (
                    <div className="flex items-center text-gray-600 mt-1">
                      <Building2 className="h-4 w-4 mr-1" />
                      <span className="text-sm">{unit.building.name}</span>
                    </div>
                  )}
                </div>
                <Badge variant={unit.active ? "default" : "secondary"}>
                  {unit.active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Tipo</p>
                    <p className="text-sm font-medium">{unit.property_type?.name || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Renta Mensual</p>
                    <p className="text-sm font-medium">{formatCurrency(unit.monthly_rent)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Esquema de Pago</p>
                    <p className="text-sm font-medium capitalize">{unit.payment_scheme}</p>
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
    </div>
  );
}
