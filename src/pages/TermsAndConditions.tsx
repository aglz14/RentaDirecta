import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#323232] mb-8">Términos y Condiciones</h1>
          <div className="bg-white p-8 rounded-xl custom-shadow space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-[#323232] mb-4">1. Aceptación de los Términos</h2>
              <p className="text-gray-600">
                Al acceder y utilizar los servicios de PropTech, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-[#323232] mb-4">2. Uso del Servicio</h2>
              <p className="text-gray-600">
                Nuestros servicios están diseñados para ayudar en la gestión de propiedades. Usted se compromete a utilizar el servicio solo para propósitos legales y de acuerdo con estos términos.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-[#323232] mb-4">3. Cuentas de Usuario</h2>
              <p className="text-gray-600">
                Al registrarse en PropTech, usted es responsable de mantener la seguridad de su cuenta y contraseña. La compañía no será responsable de ninguna pérdida o daño por el incumplimiento de esta obligación de seguridad.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}