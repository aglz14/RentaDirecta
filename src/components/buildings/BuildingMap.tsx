import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from '@/types/buildings';

interface BuildingMapProps {
  building: Building;
}

export function BuildingMap({ building }: BuildingMapProps) {
  const address = `${building.street} ${building.exterior_number}, ${building.neighborhood}, ${building.city}, ${building.state}, ${building.country}`;
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodedAddress}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ubicación</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200">
          <iframe
            title="Ubicación del Inmueble"
            width="100%"
            height="100%"
            frameBorder="0"
            src={mapUrl}
            allowFullScreen
          />
        </div>
      </CardContent>
    </Card>
  );
}