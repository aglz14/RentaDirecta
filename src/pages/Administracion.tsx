import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { Properties } from '@/components/dashboard/Properties';
import { Tenants } from '@/components/dashboard/Tenants';
import { Payments } from '@/components/dashboard/Payments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, FileText, Receipt, Wrench } from 'lucide-react';

export default function Administracion() {
  const [activeTab, setActiveTab] = useState('properties');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <DashboardNav />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Administración</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-white p-1 flex space-x-2">
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Propiedades
              </TabsTrigger>
              <TabsTrigger value="tenants" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Inquilinos
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documentos
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Pagos
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Servicios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="properties">
              <Properties />
            </TabsContent>
            <TabsContent value="tenants">
              <Tenants />
            </TabsContent>
            <TabsContent value="documents">
              <div className="bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Documentos Legales</h2>
                {/* Add document management UI here */}
              </div>
            </TabsContent>
            <TabsContent value="payments">
              <Payments />
            </TabsContent>
            <TabsContent value="services">
              <div className="bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Servicios y Mantenimiento</h2>
                {/* Add services management UI here */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}