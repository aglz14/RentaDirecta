import React from 'react';
import { Button } from '@/components/ui/button';

export function Contact() {
  return (
    <section className="py-24 bg-gray-50" id="contact">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-[#323232] mb-16">Contáctanos</h2>
        <form className="space-y-8 bg-white p-12 rounded-xl custom-shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-medium text-[#323232] mb-2">Nombre</label>
              <input
                type="text"
                className="w-full p-3 bg-white text-[#323232] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00A86B] focus:border-transparent"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-[#323232] mb-2">Email</label>
              <input
                type="email"
                className="w-full p-3 bg-white text-[#323232] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00A86B] focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-lg font-medium text-[#323232] mb-2">Mensaje</label>
            <textarea
              className="w-full p-3 bg-white text-[#323232] border border-gray-200 rounded-lg h-40 focus:ring-2 focus:ring-[#00A86B] focus:border-transparent"
              placeholder="¿En qué podemos ayudarte?"
            ></textarea>
          </div>
          <Button className="w-full bg-[#00A86B] hover:bg-[#009060] text-white py-6 text-lg">
            Enviar Mensaje
          </Button>
        </form>
      </div>
    </section>
  );
}