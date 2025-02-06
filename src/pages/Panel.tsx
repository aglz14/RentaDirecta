import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default function Panel() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <DashboardNav />
      <main className="flex-1">
        <DashboardContent />
      </main>
      <Footer />
    </div>
  );
}