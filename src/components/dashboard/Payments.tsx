import { useState, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Receipt,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface Payment {
  id: string;
  tenant_id: string;
  property_id: string;
  amount: number;
  date: string;
  payment_method: {
    method: string;
  };
  status: "pending" | "completed" | "failed";
  property: {
    name: string;
    unit_number: string;
    building: {
      name: string;
    };
  };
  tenant: {
    first_name: string;
    last_name: string;
  };
}

export function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPayments = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from("payments")
        .select(
          `
          id,
          tenant_id,
          property_id,
          amount,
          date,
          payment_method,
          status,
          property:properties!inner (
            name,
            unit_number,
            building:buildings!inner (
              name
            )
          ),
          tenant:tenants!inner (
            profile:profiles!inner (
              first_name,
              last_name
            )
          )
        `,
        )
        .order("date", { ascending: false });

      if (error) throw error;

      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast({
        title: "Error",
        description:
          "No se pudieron cargar los pagos. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const totalIncome = payments.reduce(
    (sum, payment) =>
      payment.status === "completed" ? sum + payment.amount : sum,
    0,
  );

  const pendingAmount = payments.reduce(
    (sum, payment) =>
      payment.status === "pending" ? sum + payment.amount : sum,
    0,
  );

  const currentMonthPayments = payments.filter((payment) => {
    const paymentDate = new Date(payment.date);
    const now = new Date();
    return (
      paymentDate.getMonth() === now.getMonth() &&
      paymentDate.getFullYear() === now.getFullYear()
    );
  });

  const monthlyProgress =
    (currentMonthPayments.reduce(
      (sum, payment) =>
        payment.status === "completed" ? sum + payment.amount : sum,
      0,
    ) /
      currentMonthPayments.reduce(
        (sum, payment) => sum + payment.property.monthly_rent,
        0,
      )) *
    100;

  const filteredPayments = payments.filter((payment) => {
    const searchLower = searchTerm.toLowerCase();
    const tenantName =
      `${payment.tenant.profile.first_name} ${payment.tenant.profile.last_name}`.toLowerCase();
    return (
      tenantName.includes(searchLower) ||
      payment.property.name.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Pagos</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ingresos Totales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-[#4CAF50]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${totalIncome.toLocaleString("es-MX")}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +20.1% vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pagos Pendientes
              </CardTitle>
              <Calendar className="h-4 w-4 text-[#4CAF50]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${pendingAmount.toLocaleString("es-MX")}
              </div>
              <p className="text-xs text-red-600 flex items-center mt-1">
                <ArrowDownRight className="h-4 w-4 mr-1" />3 pagos por cobrar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Progreso Mensual
              </CardTitle>
              <DollarSign className="h-4 w-4 text-[#4CAF50]" />
            </CardHeader>
            <CardContent>
              <Progress value={monthlyProgress} className="h-2 mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(monthlyProgress)}%
              </div>
              <p className="text-xs text-gray-600 mt-1">
                del total esperado este mes
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Historial de Pagos
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar pagos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 w-64"
                />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Inquilino</TableHead>
                <TableHead>Inmueble</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {payment.tenant.profile.first_name}{" "}
                    {payment.tenant.profile.last_name}
                  </TableCell>
                  <TableCell>Torre Centro</TableCell>
                  <TableCell>Departamento 101</TableCell>
                  <TableCell>
                    {new Date(payment.date).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {payment.payment_method.method === "transfer"
                      ? "Transferencia"
                      : payment.payment_method.method === "debit"
                        ? "Débito"
                        : payment.payment_method.method === "credit"
                          ? "Crédito"
                          : payment.payment_method.method === "convenience"
                            ? "Tienda"
                            : "Efectivo"}
                  </TableCell>
                  <TableCell>
                    ${payment.amount.toLocaleString("es-MX")}
                  </TableCell>
                  <TableCell className={getStatusColor(payment.status)}>
                    {payment.status === "completed"
                      ? "Completado"
                      : payment.status === "pending"
                        ? "Pendiente"
                        : "Fallido"}
                  </TableCell>
                  <TableCell>
                    <button
                      className="inline-flex items-center gap-1 px-2 py-1 text-sm text-[#00A86B] hover:bg-[#00A86B]/10 rounded-md"
                      onClick={() => {
                        /* TODO: Implement invoice sending */
                      }}
                    >
                      <Receipt className="h-4 w-4" />
                      <span>Enviar factura</span>
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
