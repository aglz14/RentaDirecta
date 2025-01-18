import { Building2, Calendar, CreditCard, Users } from "lucide-react";
import { Property } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const schemeColor = property.paymentScheme === 'subscription' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{property.name}</CardTitle>
            <CardDescription>{property.address}</CardDescription>
          </div>
          <Badge variant="outline" className={schemeColor}>
            {property.paymentScheme === 'subscription' ? 'Suscripción' : 'Flex'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Estado: {property.active ? 'Activo' : 'Inactivo'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Inquilino: {property.tenantId ? 'Ocupado' : 'Vacante'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Renta: ${property.monthlyRent}/mes</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Próximo Pago: día 15</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}