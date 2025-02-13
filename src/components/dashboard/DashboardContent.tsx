
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  address: string;
  monthly_rent: number;
  active: boolean;
  square_meters: number;
  property_type: {
    name: string;
  };
  property_type_id: string;
  building_id?: string;
}

export function DashboardContent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProperties = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          name,
          address,
          monthly_rent,
          active,
          square_meters,
          property_type:property_type_id (
            name
          ),
          property_type_id,
          building_id
        `)
        .eq('owner_id', user.id);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las propiedades.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user]);

  // Sample data - replace with real data from your backend
  const revenueData = [
    { month: 'Ene', income: 4000, expenses: 2400 },
    { month: 'Feb', income: 3000, expenses: 1398 },
    { month: 'Mar', income: 2000, expenses: 9800 },
    { month: 'Abr', income: 2780, expenses: 3908 },
    { month: 'May', income: 1890, expenses: 4800 },
    { month: 'Jun', income: 2390, expenses: 3800 },
  ];

  const leasingData = [
    { name: '1-3 meses', value: 400 },
    { name: '4-6 meses', value: 300 },
    { name: '7-12 meses', value: 300 },
    { name: '+12 meses', value: 200 },
  ];

  const rentsData = [
    { month: 'Ene', collected: 4000, pending: 2400 },
    { month: 'Feb', collected: 3000, pending: 1398 },
    { month: 'Mar', collected: 2000, pending: 9800 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const rentedUnits = properties.filter(p => p.active).length;
  const freeUnits = properties.filter(p => !p.active).length;
  const subscriptionUnits = properties.filter(p => p.active).length; // Replace with actual subscription logic
  const rentedSquareMeters = properties.filter(p => p.active).reduce((acc, p) => acc + (p.square_meters || 0), 0);
  const freeSquareMeters = properties.filter(p => !p.active).reduce((acc, p) => acc + (p.square_meters || 0), 0);
  const activeSquareMeters = properties.filter(p => p.active).reduce((acc, p) => acc + (p.square_meters || 0), 0);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Panel Principal</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Graph */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos y Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart width={500} height={300} data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#8884d8" />
              <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
            </LineChart>
          </CardContent>
        </Card>

        {/* Leasing Expiration */}
        <Card>
          <CardHeader>
            <CardTitle>Vencimiento de Contratos</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart width={500} height={300}>
              <Pie
                data={leasingData}
                cx={250}
                cy={150}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {leasingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </CardContent>
        </Card>

        {/* Rents Graph */}
        <Card>
          <CardHeader>
            <CardTitle>Rentas Cobradas vs Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={500} height={300} data={rentsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="collected" fill="#8884d8" />
              <Bar dataKey="pending" fill="#82ca9d" />
            </BarChart>
          </CardContent>
        </Card>

        {/* Status Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Unidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Ocupadas</p>
                <p className="text-2xl font-bold">{rentedUnits}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Libres</p>
                <p className="text-2xl font-bold">{freeUnits}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Suscripciones Activas</p>
                <p className="text-2xl font-bold">{subscriptionUnits}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">M² Ocupados</p>
                <p className="text-2xl font-bold">{rentedSquareMeters}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">M² Libres</p>
                <p className="text-2xl font-bold">{freeSquareMeters}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">M² Activos</p>
                <p className="text-2xl font-bold">{activeSquareMeters}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
