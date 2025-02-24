
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'react-router-dom';

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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uso</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">M2 Rentables</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renta</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquilinos</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {units.map((unit) => (
              <tr key={unit.id}>
                <td className="px-4 py-3 whitespace-nowrap">
                  {getStatusBadge(unit.active)}
                </td>
                <td className="px-4 py-3">{unit.name}</td>
                <td className="px-4 py-3">{unit.property_type?.name}</td>
                <td className="px-4 py-3">{unit.square_meters_toRent} m²</td>
                <td className="px-4 py-3">${unit.monthly_rent?.toLocaleString()}</td>
                <td className="px-4 py-3">{unit.city}</td>
                <td className="px-4 py-3">{unit.state}</td>
                <td className="px-4 py-3">
                  {unit.tenants?.map(tenant => 
                    `${tenant.profile.first_name} ${tenant.profile.last_name}`
                  ).join(', ')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
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
