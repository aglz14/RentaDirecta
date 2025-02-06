import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { Properties } from '@/components/dashboard/Properties';
import { Tenants } from '@/components/dashboard/Tenants';
import { Payments } from '@/components/dashboard/Payments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, FileText, Receipt, Wrench } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Administracion() {
  const [activeTab, setActiveTab] = useState('properties');

  const tabs = [
    { id: 'properties', label: 'Propiedades', icon: Building2 },
    { id: 'tenants', label: 'Inquilinos', icon: Users },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'payments', label: 'Pagos', icon: Receipt },
    { id: 'services', label: 'Servicios', icon: Wrench },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <DashboardNav />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Administración</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
              <TabsList className="bg-white p-1 flex h-14 w-full">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex-1 flex items-center justify-center gap-2 px-4"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>

            <TabsContent value="properties">
              <Properties />
            </TabsContent>
            <TabsContent value="tenants">
              <Tenants />
            </TabsContent>
            <TabsContent value="documents">
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Documentos Legales</h2>
                {/* Add document management UI here */}
              </div>
            </TabsContent>
            <TabsContent value="payments">
              <Payments />
            </TabsContent>
            <TabsContent value="services">
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow">
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