import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { PropertyCard } from './property-card';
import { AddPropertyDialog } from './AddPropertyDialog';

interface Property {
  id: string;
  name: string;
  monthly_rent: number;
  active: boolean;
  property_type: {
    name: string;
  };
  property_type_id: string;
  building_id?: string;
  street: string;
  unit_number: string;
  neighborhood: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
}

interface UnitsProps {
  properties: Property[];
  isLoading: boolean;
  setSearchTerm: (term: string) => void;
}

export function Units({ properties, isLoading, setSearchTerm }: UnitsProps) {
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddPropertySuccess = () => {
    toast({
      title: "Propiedad agregada",
      description: "La propiedad ha sido agregada exitosamente.",
    });
    setIsAddPropertyOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar propiedades..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200 w-full"
          />
        </div>
        <Button 
          onClick={() => setIsAddPropertyOpen(true)}
          className="bg-[#1B2956] hover:bg-[#141d3d] text-white w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Propiedad
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      <AddPropertyDialog
        isOpen={isAddPropertyOpen}
        onClose={() => setIsAddPropertyOpen(false)}
        onSuccess={handleAddPropertySuccess}
      />
    </div>
  );
}