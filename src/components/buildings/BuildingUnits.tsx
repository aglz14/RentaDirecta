import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useParams, useNavigate } from 'react-router-dom';

interface Property {
  id: string;
  name: string;
  active: boolean;
  property_type: {
    name: string;
  };
  square_meters_toRent: number;
  monthly_rent: number;
  city: string;
  state: string;
  tenants: {
    profile: {
      first_name: string;
      last_name: string;
    };
  }[];
}

export function BuildingUnits() {
  const [units, setUnits] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id: buildingId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        if (!buildingId) return;

        const { data, error } = await supabase
          .from('properties')
          .select(`
            id,
            name,
            active,
            property_type:property_type_id (
              name
            ),
            square_meters_toRent,
            monthly_rent,
            city,
            state,
            tenants!tenants_property_id_fkey (
              profile:profiles!tenants_profile_id_fkey (
                first_name,
                last_name
              )
            )
          `)
          .eq('building_id', buildingId);

        if (error) throw error;
        setUnits(data || []);
      } catch (error) {
        console.error('Error fetching units:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnits();
  }, [buildingId]);

  const getStatusBadge = (status: boolean) => {
    if (status) {
      return <Badge className="bg-green-500">Activo</Badge>;
    }
    return <Badge variant="secondary">Inactivo</Badge>;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Unidades</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                m²
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Renta Mensual
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Inquilinos
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {units.map((unit) => (
              <tr 
                key={unit.id} 
                className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/administracion/propiedad/${unit.id}`)}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  {getStatusBadge(unit.active)}
                </td>
                <td className="px-4 py-3">
                  <span className="text-gray-900 font-medium">{unit.name}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                  {unit.property_type?.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                  {unit.square_meters_toRent}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-900 font-medium">
                  ${unit.monthly_rent?.toLocaleString('en-US')}
                </td>
                <td className="px-4 py-3 text-gray-900">
                  {unit.city}, {unit.state}
                </td>
                <td className="px-4 py-3 text-gray-900">
                  {unit.tenants?.map((tenant) =>
                    `${tenant.profile.first_name} ${tenant.profile.last_name}`
                  ).join(', ')}
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-800 hover:bg-green-100">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800 hover:bg-red-100">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}