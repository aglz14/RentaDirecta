import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#323232] mb-8">Política de Privacidad</h1>
          <div className="bg-white p-8 rounded-xl custom-shadow space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-[#323232] mb-4">1. Recopilación de Información</h2>
              <p className="text-gray-600">
                Recopilamos información que usted nos proporciona directamente cuando utiliza nuestros servicios, incluyendo datos personales y de contacto necesarios para la gestión de propiedades.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-[#323232] mb-4">2. Uso de la Información</h2>
              <p className="text-gray-600">
                Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestros servicios, así como para comunicarnos con usted sobre actualizaciones y nuevas características.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-[#323232] mb-4">3. Protección de Datos</h2>
              <p className="text-gray-600">
                Implementamos medidas de seguridad diseñadas para proteger sus datos personales contra acceso no autorizado y uso indebido.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}