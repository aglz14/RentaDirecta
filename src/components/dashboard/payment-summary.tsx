import { DollarSign, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-900">Ingresos Totales</CardTitle>
          <DollarSign className="h-4 w-4 text-[#00A86B]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">$152,318.89</div>
          <p className="text-xs text-gray-600">
            +20.1% vs mes anterior
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-900">Propiedades Activas</CardTitle>
          <TrendingUp className="h-4 w-4 text-[#00A86B]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">12</div>
          <p className="text-xs text-gray-600">
            +2 nuevas este mes
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-900">Pagos Pendientes</CardTitle>
          <Clock className="h-4 w-4 text-[#00A86B]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">3</div>
          <p className="text-xs text-gray-600">
            Vencen en 7 días
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-900">Pagos Atrasados</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">1</div>
          <p className="text-xs text-gray-600">
            Requiere atención
          </p>
        </CardContent>
      </Card>
    </div>
  );
}