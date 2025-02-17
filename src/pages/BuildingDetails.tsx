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

// Dummy documents data
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

  useEffect(() => {
    const fetchBuilding = async () => {
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
    };

    fetchBuilding();
  }, [id]);

  if (!building) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <BuildingHeader />
            <BuildingInfo building={building} />
            <BuildingUsers />
            <BuildingMap building={building} />
            <BuildingDistribution />
            <BuildingUnits />
            <BuildingDocuments documents={documents} />
            <BuildingExpenses />
            <BuildingPerformance />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}