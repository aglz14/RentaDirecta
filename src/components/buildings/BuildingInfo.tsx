import { MapPin, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from '@/types/buildings';

interface BuildingInfoProps {
  building: Building;
}

export function BuildingInfo({ building }: BuildingInfoProps) {
  const formatAddress = (building: Building) => {
    return `${building.street} ${building.exterior_number}${
      building.interior_number ? `, Int. ${building.interior_number}` : ''
    }, ${building.neighborhood}, ${building.zip_code}, ${building.city}, ${building.state}, ${
      building.country
    }`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{building.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{formatAddress(building)}</span>
          </div>
          
          {building.predial && (
            <div className="flex items-center text-gray-600">
              <FileText className="h-4 w-4 mr-2" />
              <div>
                <span className="text-sm text-gray-500">Cuenta Predial: </span>
                <span>{building.predial}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}