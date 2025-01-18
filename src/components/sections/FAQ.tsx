import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "¿Cómo funciona el sistema de cobro automático?",
    answer: "Nuestro sistema de cobro automático procesa los pagos de manera programada según el plan elegido (quincenal o mensual). Los inquilinos configuran su método de pago preferido y el sistema se encarga de realizar los cobros en las fechas establecidas, enviando notificaciones y comprobantes automáticamente."
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos múltiples métodos de pago incluyendo tarjetas de crédito/débito, transferencias bancarias y pagos en establecimientos convenientes. Todos los pagos son procesados de manera segura a través de nuestra plataforma encriptada."
  },
  {
    question: "¿Cómo garantizan la seguridad de los datos?",
    answer: "Implementamos múltiples capas de seguridad, incluyendo encriptación de datos, autenticación de dos factores y monitoreo constante. Cumplimos con los estándares más altos de seguridad en la industria para proteger la información de propietarios e inquilinos."
  },
  {
    question: "¿Puedo gestionar múltiples propiedades?",
    answer: "Sí, nuestra plataforma está diseñada para gestionar múltiples propiedades desde un solo dashboard. Podrás ver el estado de todas tus propiedades, pagos y inquilinos de manera centralizada y organizada."
  },
  {
    question: "¿Qué pasa si un inquilino se atrasa en sus pagos?",
    answer: "El sistema envía recordatorios automáticos antes de la fecha de pago y notificaciones si ocurre un atraso. Además, tienes acceso a un registro detallado de pagos y herramientas de comunicación directa con los inquilinos para resolver cualquier situación."
  },
  {
    question: "¿Ofrecen soporte técnico?",
    answer: "Sí, contamos con soporte técnico disponible 24/7 a través de chat, correo electrónico y teléfono. Nuestro equipo está capacitado para resolver cualquier duda o incidente que pueda surgir durante el uso de la plataforma."
  }
];

export function FAQ() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#323232] mb-4">Preguntas Frecuentes</h2>
          <p className="text-xl text-gray-600">Resolvemos tus dudas sobre nuestra plataforma</p>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white rounded-lg border border-gray-200 px-6"
            >
              <AccordionTrigger className="text-lg font-medium text-[#323232] hover:text-[#00A86B] transition-colors">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}