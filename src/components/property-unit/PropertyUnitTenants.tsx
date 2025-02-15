import { Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Tenant {
  id: string;
  property_id: string;
  payment_scheme: 'subscription' | 'flex';
  last_payment_date: string | null;
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    whatsapp: string;
  } | null;
}

interface PropertyUnitTenantsProps {
  tenants: Tenant[];
}

export function PropertyUnitTenants({ tenants }: PropertyUnitTenantsProps) {
  const formatDate = (date: string | null) => {
    if (!date) return 'Sin pagos registrados';
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPaymentScheme = (scheme: 'subscription' | 'flex') => {
    return scheme === 'subscription' ? 'Suscripción' : 'Flex';
  };

  const openWhatsApp = (whatsapp: string) => {
    window.open(`https://wa.me/52${whatsapp}`, '_blank');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Inquilinos</CardTitle>
        <div className="text-sm text-gray-500">
          {tenants.length} {tenants.length === 1 ? 'inquilino' : 'inquilinos'}
        </div>
      </CardHeader>
      <CardContent>
        {tenants.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay inquilinos registrados</p>
        ) : (
          <div className="space-y-6">
            {tenants.map((tenant) => {
              // Skip rendering if profile is null
              if (!tenant.profile) {
                return null;
              }

              return (
                <div key={tenant.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {tenant.profile.first_name} {tenant.profile.last_name}
                      </h3>
                      
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#4CAF50]" />
                        <a 
                          href={`mailto:${tenant.profile.email}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {tenant.profile.email}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[#4CAF50]" />
                        <button
                          onClick={() => openWhatsApp(tenant.profile.whatsapp)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {tenant.profile.whatsapp}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Plan de Pago:</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {formatPaymentScheme(tenant.payment_scheme)}
                        </Badge>
                      </div>

                      <div>
                        <span className="text-sm text-gray-500">Último Pago:</span>
                        <p className="text-gray-900">{formatDate(tenant.last_payment_date)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}