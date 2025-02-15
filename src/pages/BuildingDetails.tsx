
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Building {
  id: string;
  name: string;
  address: string;
  property_type: {
    name: string;
  };
  active: boolean;
  monthly_rent: number;
  building?: {
    name: string;
    address: string;
  };
}

export default function BuildingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [building, setBuilding] = useState<Building | null>(null);

  useEffect(() => {
    const fetchBuilding = async () => {
      const { data, error } = await supabase
        .from('buildings')
        .select(`
          *,
          property_type (
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching building:', error);
        return;
      }

      setBuilding(data);
    };

    fetchBuilding();
  }, [id]);

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount == null) return '$0';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  if (!building) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6 bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/administracion')}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Detalles del Inmueble</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{building.name}</h3>
              <p className="flex items-center text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {building.address}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#4CAF50]" />
                  <span className="text-gray-700">
                    {building.property_type?.name || 'Tipo no especificado'}
                  </span>
                </div>
                <Badge variant="outline" className={building.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {building.active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#4CAF50]" />
                <span className="text-gray-700">
                  {formatCurrency(building.monthly_rent)}/mes
                </span>
              </div>
            </div>
          </div>

          {building.building && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Información del Edificio</h3>
              <p className="text-gray-700">{building.building.name}</p>
              <p className="text-gray-600">{building.building.address}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
