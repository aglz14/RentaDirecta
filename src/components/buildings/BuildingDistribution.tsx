import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const distributionData = {
  rentableArea: 1200,
  constructionArea: 1500,
  landArea: 2000,
  parkingArea: 400,
  parkingSpaces: 30,
  pricePerSqm: 250,
  maintenancePerSqm: 25
};

export function BuildingDistribution() {
  const formatNumber = (num: number) => num.toLocaleString('es-MX');
  const formatCurrency = (num: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">M² Rentables</h3>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(distributionData.rentableArea)}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">M² de Construcción</h3>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(distributionData.constructionArea)}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">M² de Terreno</h3>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(distributionData.landArea)}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">M² de Estacionamiento</h3>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(distributionData.parkingArea)}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Cajones de Estacionamiento</h3>
            <p className="text-2xl font-bold text-gray-900">{distributionData.parkingSpaces}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Precio por M²</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(distributionData.pricePerSqm)}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Mantenimiento por M²</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(distributionData.maintenancePerSqm)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}