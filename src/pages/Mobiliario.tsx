import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Warehouse } from 'lucide-react';

export default function Mobiliario() {
  const [activeTab, setActiveTab] = useState('furniture');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <DashboardNav />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mobiliario</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-white p-1 flex space-x-2">
              <TabsTrigger value="furniture" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Bienes Muebles
              </TabsTrigger>
              <TabsTrigger value="warehouses" className="flex items-center gap-2">
                <Warehouse className="h-4 w-4" />
                Almacenes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="furniture">
              <div className="bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Bienes Muebles</h2>
                {/* Add furniture management UI here */}
              </div>
            </TabsContent>
            <TabsContent value="warehouses">
              <div className="bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Almacenes</h2>
                {/* Add warehouse management UI here */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}