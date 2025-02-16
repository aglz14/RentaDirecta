import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BuildingPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Monthly Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                Ingresos del Periodo
              </h3>
              <p className="text-2xl font-bold text-green-800">$120,000</p>
              <p className="text-sm text-green-600 mt-1">
                Total de rentas cobradas
              </p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-700 mb-2">
                Gastos del Periodo
              </h3>
              <p className="text-2xl font-bold text-red-800">$61,300</p>
              <p className="text-sm text-red-600 mt-1">Total de gastos</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">NOI</h3>
              <p className="text-2xl font-bold text-blue-800">$58,700</p>
              <p className="text-sm text-blue-600 mt-1">
                Ingreso Operativo Neto
              </p>
            </div>
          </div>

          {/* Performance Details */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">
              Desglose de Rendimiento
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Margen Operativo</span>
                <span className="font-semibold">48.92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ocupación</span>
                <span className="font-semibold">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Capitalization Rate</span>
                <span className="font-semibold">12.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Costo por M² Mantenido</span>
                <span className="font-semibold">$24.52</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
