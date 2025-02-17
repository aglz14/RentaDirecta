
import { Building2, DollarSign, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Property {
  name: string;
  monthly_rent: number;
  currency: string;
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
  active: boolean;
  owner_id: string;
  owner: {
    first_name: string;
    last_name: string;
    email: string;
  };
  predial?: string | null;
  buildings?: {
    name: string;
  } | null;
}

interface PropertyUnitInfoProps {
  property: Property | null;
}

export function PropertyUnitInfo({ property }: PropertyUnitInfoProps) {
  if (!property) return null;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatAddress = () => {
    return `${property.street} ${property.unit_number}, ${property.neighborhood}, ${property.zip_code}, ${property.city}, ${property.state}, ${property.country}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de la Propiedad</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#4CAF50]" />
              <div>
                <p className="text-sm text-gray-500">Tipo de Propiedad</p>
                <p className="font-medium">{property.property_types.name}</p>
              </div>
            </div>

            {property.buildings && (
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#4CAF50]" />
                <div>
                  <p className="text-sm text-gray-500">Nombre del Inmueble</p>
                  <p className="font-medium">{property.buildings.name}</p>
                </div>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">Dirección</p>
              <p className="font-medium">{formatAddress()}</p>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#4CAF50]" />
              <div>
                <p className="text-sm text-gray-500">Renta Mensual ({property.currency})</p>
                <p className="font-medium">{formatCurrency(property.monthly_rent, property.currency)}</p>
              </div>
            </div>

            {property.predial && (
              <div>
                <p className="text-sm text-gray-500">Cuenta Predial</p>
                <p className="font-medium">{property.predial}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">Estado de la propiedad</p>
              <Badge variant={property.active ? 'success' : 'secondary'}>
                {property.active ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Propietario</p>
              <p className="font-medium">{`${property.owner.first_name} ${property.owner.last_name}`}</p>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#4CAF50]" />
              <div>
                <p className="text-sm text-gray-500">Email del Propietario</p>
                <a 
                  href={`mailto:${property.owner.email}`}
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  {property.owner.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
