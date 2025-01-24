import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="custom-footer py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center hover:opacity-90 transition-opacity">
              <div className="w-12 h-12 flex-shrink-0">
                <img 
                  src="https://kgepsmcikgxoqjzhjxwq.supabase.co/storage/v1/object/public/logos/WhatsApp%20Image%202025-01-16%20at%2019.44.30%20(2).jpeg" 
                  alt="RentaDirecta Logo" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </Link>
            <p className="text-gray-300">
              Optimizando la gestión de propiedades para propietarios e inquilinos.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#00A86B] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#00A86B] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#00A86B] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#00A86B] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Compañía</h3>
            <ul className="space-y-4">
              <li>
                <Button variant="link" className="text-base text-gray-300 hover:text-[#00A86B] p-0 h-auto font-normal">
                  Iniciar Sesión
                </Button>
              </li>
              <li>
                <Button variant="link" className="text-base text-gray-300 hover:text-[#00A86B] p-0 h-auto font-normal">
                  Registrarse
                </Button>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/terminos" className="text-base text-gray-300 hover:text-[#00A86B] transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="text-base text-gray-300 hover:text-[#00A86B] transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-base text-gray-300 hover:text-[#00A86B] transition-colors">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section with Icons */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#00A86B]" />
                <a href="mailto:info@rentadirecta.mx" className="text-base text-gray-300 hover:text-[#00A86B] transition-colors">
                  info@rentadirecta.mx
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#00A86B]" />
                <a href="tel:+528112345678" className="text-base text-gray-300 hover:text-[#00A86B] transition-colors">
                  +52 (81) 1485-7684
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-[#00A86B]" />
                <span className="text-base text-gray-300">Monterrey, México</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-center text-base text-gray-400">
            © {new Date().getFullYear()} RentaDirecta. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
