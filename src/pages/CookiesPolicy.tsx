import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function CookiesPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#323232] mb-8">Política de Cookies</h1>
          <div className="bg-white p-8 rounded-xl custom-shadow space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-[#323232] mb-4">1. ¿Qué son las Cookies?</h2>
              <p className="text-gray-600">
                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web. Nos ayudan a proporcionar una mejor experiencia de usuario.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-[#323232] mb-4">2. Tipos de Cookies que Utilizamos</h2>
              <p className="text-gray-600">
                Utilizamos cookies esenciales para el funcionamiento del sitio, cookies de rendimiento para analizar cómo se utiliza nuestro sitio, y cookies de funcionalidad para recordar sus preferencias.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-[#323232] mb-4">3. Control de Cookies</h2>
              <p className="text-gray-600">
                Puede controlar y/o eliminar las cookies según lo desee. Puede eliminar todas las cookies que ya están en su dispositivo y puede configurar la mayoría de los navegadores para evitar que se coloquen.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}