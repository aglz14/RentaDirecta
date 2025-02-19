
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const initialDistributionData = {
  rentableArea: 1200,
  constructionArea: 1500,
  landArea: 2000,
  parkingArea: 400,
  parkingSpaces: 30,
  pricePerSqm: 250,
  maintenancePerSqm: 25
};

export function BuildingDistribution() {
  const [distributionData, setDistributionData] = useState(initialDistributionData);

  const formatNumber = (num: number) => num.toLocaleString('es-MX');
  const formatCurrency = (num: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num);

  const handleChange = (field: keyof typeof distributionData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setDistributionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">M² Rentables</h3>
            <Input
              type="number"
              value={distributionData.rentableArea}
              onChange={handleChange('rentableArea')}
              className="text-2xl font-bold text-gray-900"
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">M² de Construcción</h3>
            <Input
              type="number"
              value={distributionData.constructionArea}
              onChange={handleChange('constructionArea')}
              className="text-2xl font-bold text-gray-900"
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">M² de Terreno</h3>
            <Input
              type="number"
              value={distributionData.landArea}
              onChange={handleChange('landArea')}
              className="text-2xl font-bold text-gray-900"
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">M² de Estacionamiento</h3>
            <Input
              type="number"
              value={distributionData.parkingArea}
              onChange={handleChange('parkingArea')}
              className="text-2xl font-bold text-gray-900"
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Cajones de Estacionamiento</h3>
            <Input
              type="number"
              value={distributionData.parkingSpaces}
              onChange={handleChange('parkingSpaces')}
              className="text-2xl font-bold text-gray-900"
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Precio por M²</h3>
            <Input
              type="number"
              value={distributionData.pricePerSqm}
              onChange={handleChange('pricePerSqm')}
              className="text-2xl font-bold text-gray-900"
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Mantenimiento por M²</h3>
            <Input
              type="number"
              value={distributionData.maintenancePerSqm}
              onChange={handleChange('maintenancePerSqm')}
              className="text-2xl font-bold text-gray-900"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
