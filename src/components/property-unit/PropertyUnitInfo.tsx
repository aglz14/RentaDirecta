import { Building2, MapPin, Mail, DollarSign, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  owner_name: string;
  owner_email: string;
  predial?: string | null;
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

            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#4CAF50]" />
              <div>
                <p className="text-sm text-gray-500">Dirección</p>
                <p className="font-medium">{formatAddress()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#4CAF50]" />
              <div>
                <p className="text-sm text-gray-500">Renta Mensual</p>
                <p className="font-medium">{formatCurrency(property.monthly_rent, property.currency)}</p>
              </div>
            </div>

            {property.predial && (
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#4CAF50]" />
                <div>
                  <p className="text-sm text-gray-500">Cuenta Predial</p>
                  <p className="font-medium">{property.predial}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Propietario</p>
              <p className="font-medium">{property.owner_name}</p>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#4CAF50]" />
              <div>
                <p className="text-sm text-gray-500">Email del Propietario</p>
                <a 
                  href={`mailto:${property.owner_email}`}
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  {property.owner_email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}