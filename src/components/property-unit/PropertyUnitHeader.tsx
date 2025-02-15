import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface Property {
  name: string;
  active: boolean;
}

interface PropertyUnitHeaderProps {
  property: Property | null;
}

export function PropertyUnitHeader({ property }: PropertyUnitHeaderProps) {
  const navigate = useNavigate();

  if (!property) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/administracion')}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">{property.name}</h2>
        <Badge variant={property.active ? 'success' : 'secondary'}>
          {property.active ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>
    </div>
  );
}