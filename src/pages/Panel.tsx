import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default function Panel() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <DashboardNav />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
        <DashboardContent />
      </main>
      <Footer />
    </div>
  );
}