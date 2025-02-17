
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BuildingHeader } from '@/components/buildings/BuildingHeader';
import { BuildingInfo } from '@/components/buildings/BuildingInfo';
import { BuildingUsers } from '@/components/buildings/BuildingUsers';
import { BuildingMap } from '@/components/buildings/BuildingMap';
import { BuildingDistribution } from '@/components/buildings/BuildingDistribution';
import { BuildingUnits } from '@/components/buildings/BuildingUnits';
import { BuildingDocuments } from '@/components/buildings/BuildingDocuments';
import { BuildingExpenses } from '@/components/buildings/BuildingExpenses';
import { BuildingPerformance } from '@/components/buildings/BuildingPerformance';
import { Building } from '@/types/buildings';
import { Skeleton } from '@/components/ui/skeleton';

const documents = [
  {
    id: '1',
    name: 'Contrato de Arrendamiento.pdf',
    type: 'PDF',
    uploadDate: '2025-01-15',
    expirationDate: '2026-01-15',
    size: '2.5 MB'
  },
  {
    id: '2',
    name: 'Escrituras.pdf',
    type: 'PDF',
    uploadDate: '2025-01-10',
    expirationDate: null,
    size: '5.8 MB'
  }
];

export default function BuildingDetails() {
  const { id } = useParams();
  const [building, setBuilding] = useState<Building | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBuilding = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('buildings')
        .select(`
          id,
          name,
          street,
          exterior_number,
          interior_number,
          neighborhood,
          zip_code,
          city,
          state,
          country,
          predial
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching building:', error);
        return;
      }

      setBuilding(data);
      setIsLoading(false);
    };

    fetchBuilding();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : building ? (
            <div className="grid gap-6 md:gap-8">
              <BuildingHeader />
              <div className="grid md:grid-cols-2 gap-6">
                <BuildingInfo building={building} />
                <BuildingMap building={building} />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <BuildingDistribution />
                <BuildingUsers />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <BuildingUnits />
                <BuildingDocuments documents={documents} />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <BuildingExpenses />
                <BuildingPerformance />
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">Inmueble no encontrado</h2>
              <p className="mt-2 text-gray-600">El inmueble que buscas no existe o no tienes acceso a él.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
