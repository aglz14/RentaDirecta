import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function BuildingExpenses() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gastos</CardTitle>
        <Button className="bg-[#4CAF50] hover:bg-[#3d9140]">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Gasto
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concepto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Periodicidad</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Mantenimiento Elevadores</TableCell>
              <TableCell>Mantenimiento</TableCell>
              <TableCell>15/02/2025</TableCell>
              <TableCell>$15,000</TableCell>
              <TableCell>Mensual</TableCell>
              <TableCell>
                <Badge variant="success">Pagado</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Servicio de Limpieza</TableCell>
              <TableCell>Servicios</TableCell>
              <TableCell>10/02/2025</TableCell>
              <TableCell>$8,500</TableCell>
              <TableCell>Mensual</TableCell>
              <TableCell>
                <Badge variant="success">Pagado</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Seguridad</TableCell>
              <TableCell>Servicios</TableCell>
              <TableCell>01/02/2025</TableCell>
              <TableCell>$25,000</TableCell>
              <TableCell>Mensual</TableCell>
              <TableCell>
                <Badge variant="success">Pagado</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Electricidad</TableCell>
              <TableCell>Servicios Básicos</TableCell>
              <TableCell>05/02/2025</TableCell>
              <TableCell>$12,800</TableCell>
              <TableCell>Mensual</TableCell>
              <TableCell>
                <Badge variant="warning">Pendiente</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}