
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Tenant {
  id: string;
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    whatsapp: string;
  };
  property: {
    name: string;
  };
  payment_scheme: 'subscription' | 'flex';
  last_payment_date: string | null;
  status: 'Al día' | 'Pendiente' | 'Atrasado';
}

export function Tenants() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from('tenants')
          .select(`
            id,
            payment_scheme,
            last_payment_date,
            created_at,
            profile:profiles!tenants_profile_id_fkey (
              first_name,
              last_name,
              email,
              whatsapp
            ),
            property:properties!tenants_property_id_fkey (
              name
            )
          `)
          .eq('property.owner_id', user.id);

        if (error) throw error;

        const transformedTenants = data.map((tenant): Tenant => {
          let status: Tenant['status'] = 'Al día';
          if (tenant.last_payment_date) {
            const lastPayment = new Date(tenant.last_payment_date);
            const now = new Date();
            const daysDiff = Math.floor((now.getTime() - lastPayment.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysDiff > 30) {
              status = 'Atrasado';
            } else if (daysDiff > 25) {
              status = 'Pendiente';
            }
          } else {
            status = 'Pendiente';
          }

          return {
            id: tenant.id,
            profile: tenant.profile,
            property: tenant.property,
            payment_scheme: tenant.payment_scheme,
            last_payment_date: tenant.last_payment_date,
            status,
          };
        });

        setTenants(transformedTenants);
      } catch (error) {
        console.error('Error fetching tenants:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los inquilinos. Por favor, intenta de nuevo.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenants();
  }, [user, toast]);

  const filteredTenants = tenants.filter(tenant => {
    const searchTermLower = searchTerm.toLowerCase();
    const fullName = `${tenant.profile.first_name} ${tenant.profile.last_name}`.toLowerCase();
    return fullName.includes(searchTermLower) ||
           tenant.property.name.toLowerCase().includes(searchTermLower) ||
           tenant.profile.email.toLowerCase().includes(searchTermLower);
  });

  const getStatusColor = (status: Tenant['status']) => {
    switch (status) {
      case 'Al día':
        return 'text-green-600 font-medium';
      case 'Pendiente':
        return 'text-yellow-600 font-medium';
      case 'Atrasado':
        return 'text-red-600 font-medium';
      default:
        return 'text-gray-900 font-medium';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A86B]" />
      </div>
    );
  }

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
              <TableHead className="text-gray-900 font-semibold">Nombre</TableHead>
              <TableHead className="text-gray-900 font-semibold">Propiedad</TableHead>
              <TableHead className="text-gray-900 font-semibold">Email</TableHead>
              <TableHead className="text-gray-900 font-semibold">WhatsApp</TableHead>
              <TableHead className="text-gray-900 font-semibold">Plan de Pago</TableHead>
              <TableHead className="text-gray-900 font-semibold">Último Pago</TableHead>
              <TableHead className="text-gray-900 font-semibold">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No se encontraron inquilinos
                </TableCell>
              </TableRow>
            ) : (
              filteredTenants.map((tenant) => (
                <TableRow key={tenant.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {tenant.profile.first_name} {tenant.profile.last_name}
                  </TableCell>
                  <TableCell className="text-gray-900">{tenant.property.name}</TableCell>
                  <TableCell className="text-gray-900">{tenant.profile.email}</TableCell>
                  <TableCell className="text-gray-900">{tenant.profile.whatsapp}</TableCell>
                  <TableCell className="text-gray-900">
                    {tenant.payment_scheme === 'subscription' ? 'Suscripción' : 'Flex'}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {tenant.last_payment_date 
                      ? new Date(tenant.last_payment_date).toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })
                      : 'Sin pagos'}
                  </TableCell>
                  <TableCell className={getStatusColor(tenant.status)}>
                    {tenant.status}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
