import { useState } from 'react';
import { Building2, Calendar, MapPin, X } from "lucide-react";
import { Property } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface PropertyCardProps {
  property: Property;
}

interface PropertyDetails extends Property {
  property_type?: {
    name: string;
  };
  building?: {
    name: string;
    address: string;
  } | null;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const { toast } = useToast();

  const handleViewDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_type:property_type_id (
            name
          ),
          building:building_id (
            name,
            address
          )
        `)
        .eq('id', property.id)
        .single();

      if (error) throw error;
      setPropertyDetails(data);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching property details:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los detalles de la propiedad.',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount == null) return '$0.00';
    return `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <>
      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer" 
        onClick={handleViewDetails}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">{property.name}</CardTitle>
              <CardDescription className="flex items-center text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {property.address}
              </CardDescription>
            </div>
            <Badge variant="outline" className={property.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
              {property.active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#4CAF50]" />
              <span className="text-sm text-gray-700">
                {property.property_type?.name || 'Tipo no especificado'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#4CAF50]" />
              <span className="text-sm text-gray-700">
                {formatCurrency(property.monthly_rent)}/mes
              </span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4 border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            Ver Detalles
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500">
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Detalles de la Propiedad</DialogTitle>
          </DialogHeader>

          {propertyDetails && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Nombre</h3>
                  <p className="text-gray-600">{propertyDetails.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Tipo</h3>
                  <p className="text-gray-600">{propertyDetails.property_type?.name || 'No especificado'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Dirección</h3>
                <p className="text-gray-600">{propertyDetails.address}</p>
              </div>

              {propertyDetails.building && (
                <div>
                  <h3 className="font-semibold text-gray-900">Edificio</h3>
                  <p className="text-gray-600">{propertyDetails.building.name}</p>
                  <p className="text-gray-600">{propertyDetails.building.address}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Renta Mensual</h3>
                  <p className="text-gray-600">
                    {formatCurrency(propertyDetails.monthly_rent)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Estado</h3>
                  <Badge variant="outline" className={propertyDetails.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {propertyDetails.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}