
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TenantDetailsProps {
  tenant: {
    id: string;
    profile: {
      first_name: string;
      last_name: string;
      email: string;
      whatsapp: string | null;
      rfc: string | null;
      curp: string | null;
      complete_address: string | null;
    };
    payment_scheme: 'subscription' | 'flex';
    last_payment_date: string | null;
    rent: number;
    currency: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TenantDetailsDialog({ tenant, open, onOpenChange }: TenantDetailsProps) {
  if (!tenant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles del Inquilino</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Información Personal</h3>
              <p><span className="text-gray-500">Nombre:</span> {tenant.profile.first_name} {tenant.profile.last_name}</p>
              <p><span className="text-gray-500">Email:</span> {tenant.profile.email}</p>
              <p><span className="text-gray-500">WhatsApp:</span> {tenant.profile.whatsapp}</p>
              <p><span className="text-gray-500">RFC:</span> {tenant.profile.rfc || 'No registrado'}</p>
              <p><span className="text-gray-500">CURP:</span> {tenant.profile.curp || 'No registrado'}</p>
              <p><span className="text-gray-500">Domicilio Completo:</span> {tenant.profile.complete_address || 'No registrado'}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Información de Renta</h3>
              <p><span className="text-gray-500">Plan de Pago:</span> {tenant.payment_scheme === 'subscription' ? 'Suscripción' : 'Flex'}</p>
              <p><span className="text-gray-500">Renta:</span> ${tenant.rent?.toLocaleString('en-US', { minimumFractionDigits: 2 })} {tenant.currency}</p>
              <p><span className="text-gray-500">Último Pago:</span> {tenant.last_payment_date 
                ? new Date(tenant.last_payment_date).toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })
                : 'Sin pagos'}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
