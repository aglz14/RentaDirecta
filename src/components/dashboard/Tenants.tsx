import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  property: string;
  paymentScheme: 'subscription' | 'flex';
  lastPayment: string;
  status: 'Al día' | 'Pendiente' | 'Atrasado';
}

const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'Ana García',
    property: 'Departamentos Sunset 3B',
    paymentScheme: 'subscription',
    lastPayment: '2024-01-15',
    status: 'Al día',
  },
  {
    id: '2',
    name: 'Carlos Ruiz',
    property: 'Loft Centro 5A',
    paymentScheme: 'flex',
    lastPayment: '2024-01-10',
    status: 'Pendiente',
  },
  {
    id: '3',
    name: 'María López',
    property: 'Vista Jardín 2C',
    paymentScheme: 'subscription',
    lastPayment: '2023-12-15',
    status: 'Atrasado',
  },
];

export function Tenants() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTenants = mockTenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Tenant['status']) => {
    switch (status) {
      case 'Al día':
        return 'text-green-600';
      case 'Pendiente':
        return 'text-yellow-600';
      case 'Atrasado':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inquilinos</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar inquilinos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Propiedad</TableHead>
              <TableHead>Plan de Pago</TableHead>
              <TableHead>Último Pago</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell>{tenant.property}</TableCell>
                <TableCell>
                  {tenant.paymentScheme === 'subscription' ? 'Suscripción' : 'Flex'}
                </TableCell>
                <TableCell>{new Date(tenant.lastPayment).toLocaleDateString()}</TableCell>
                <TableCell className={getStatusColor(tenant.status)}>
                  {tenant.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}