import { useState } from 'react';
import { Building2, Calendar, MapPin } from "lucide-react";
import { Property } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();
  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount == null) return '$0.00';
    return `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={() => navigate(`/administracion/inmueble/${property.id}`)}
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