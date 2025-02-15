import { useState } from 'react';
import { Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { AddUnitDialog } from './AddUnitDialog';

const units = [
  {
    id: '1',
    name: 'Oficina 101',
    status: 'active',
    use: 'Oficina',
    rentableArea: 150,
    rent: 45000,
    currency: 'MXN',
    city: 'Monterrey',
    state: 'Nuevo León',
    owners: ['Ana López', 'Carlos Ramírez']
  },
  {
    id: '2',
    name: 'Oficina 102',
    status: 'inactive',
    use: 'Oficina',
    rentableArea: 200,
    rent: 60000,
    currency: 'MXN',
    city: 'Monterrey',
    state: 'Nuevo León',
    owners: ['Roberto García']
  }
];

export function BuildingUnits() {
  const navigate = useNavigate();
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);

  const formatCurrency = (amount: number, currency: string) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(amount);

  const handleAddUnitSuccess = () => {
    // TODO: Refresh units list
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Unidades</CardTitle>
        <Button 
          className="bg-[#4CAF50] hover:bg-[#3d9140]"
          onClick={() => setIsAddUnitOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Unidad
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Acciones</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Uso</TableHead>
              <TableHead>M² Rentables</TableHead>
              <TableHead>Renta</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Propietarios</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/administracion/propiedad/${unit.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={unit.status === 'active' ? 'success' : 'secondary'}
                  >
                    {unit.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{unit.name}</TableCell>
                <TableCell>{unit.use}</TableCell>
                <TableCell>{unit.rentableArea}</TableCell>
                <TableCell>{formatCurrency(unit.rent, unit.currency)}</TableCell>
                <TableCell>{unit.city}</TableCell>
                <TableCell>{unit.state}</TableCell>
                <TableCell>{unit.owners.join(', ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <AddUnitDialog
        isOpen={isAddUnitOpen}
        onClose={() => setIsAddUnitOpen(false)}
        onSuccess={handleAddUnitSuccess}
      />
    </Card>
  );
}