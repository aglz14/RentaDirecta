import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { Account } from '@/components/dashboard/Account';
import { Planes } from '@/components/dashboard/Planes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, UserPlus, CreditCard, FileInput as FileInvoice } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Cuenta() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'users', label: 'Usuarios', icon: UserPlus },
    { id: 'subscription', label: 'Suscripción', icon: CreditCard },
    { id: 'invoices', label: 'Facturas', icon: FileInvoice },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <DashboardNav />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cuenta</h1>
          
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

            <TabsContent value="profile">
              <Account />
            </TabsContent>
            <TabsContent value="users">
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Usuarios de la Organización</h2>
                {/* Add user management UI here */}
              </div>
            </TabsContent>
            <TabsContent value="subscription">
              <Planes />
            </TabsContent>
            <TabsContent value="invoices">
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Facturas</h2>
                {/* Add invoices UI here */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}