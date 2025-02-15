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

export function PropertyCard({ property, onSelect }: { property: Property; onSelect: (property: Property) => void }) {
  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount == null) return '$0.00';
    return `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={() => onSelect(property)}
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
      </CardContent>
    </Card>
  );
}