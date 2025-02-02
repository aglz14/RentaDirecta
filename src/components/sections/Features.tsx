import React from 'react';
import { Building, CheckCircle2, Users } from 'lucide-react';

const features = [
  {
    icon: <Building className="h-8 w-8" />,
    title: "Gestión Simplificada",
    description: "Administra todas tus propiedades desde una sola plataforma intuitiva."
  },
  {
    icon: <CheckCircle2 className="h-8 w-8" />,
    title: "Optimización de Ingresos",
    description: "Herramientas para optimizar tus ingresos y reducir retrasos."
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Ahorro de Tiempo",
    description: "Automatiza tareas repetitivas, mantén un registro detallado de tus inquilinos y su historial de pagos."
  }
];

export function Features() {
  return (
    <section className="py-24 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-lg font-bold text-[#4CAF50] mb-4">PROPIETARIOS</h2>
          <h2 className="text-4xl font-bold text-[#323232] mb-4">Características Principales</h2>
          <p className="text-xl text-gray-600">Todo lo que necesitas para gestionar tus propiedades de manera eficiente</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl custom-shadow">
              <div className="text-[#00A86B] mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-[#323232] mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
