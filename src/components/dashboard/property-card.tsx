import { Building2, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Property {
  id: string;
  name: string;
  monthly_rent: number;
  active: boolean;
  property_type: {
    name: string;
  };
  street: string;
  unit_number: string;
  neighborhood: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
}

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatAddress = (property: Property): string => {
    return `${property.street} ${property.unit_number}, ${property.neighborhood}, ${property.zip_code}, ${property.city}, ${property.state}, ${property.country}`;
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={() => navigate(`/administracion/propiedad/${property.id}`)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">{property.name}</CardTitle>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{formatAddress(property)}</span>
            </div>
          </div>
          <Badge variant="outline" className={property.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {property.active ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#4CAF50]" />
            <span className="text-sm text-gray-700">
              {property.property_type?.name || 'Tipo no especificado'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#4CAF50]" />
            <span className="text-sm text-gray-700">
              {formatCurrency(property.monthly_rent)}/mes
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}