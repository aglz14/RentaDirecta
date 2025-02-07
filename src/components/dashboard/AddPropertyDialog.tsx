import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface PropertyType {
  id: string;
  name: string;
}

interface Building {
  id: string;
  name: string;
}

const propertySchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  address: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  monthly_rent: z.string()
    .min(1, 'La renta mensual es requerida')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'La renta debe ser un número mayor a 0',
    }),
  property_type_id: z.string({
    required_error: 'Selecciona un tipo de propiedad',
  }),
  building_id: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface AddPropertyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPropertyDialog({ isOpen, onClose, onSuccess }: AddPropertyDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  });

  const selectedPropertyTypeId = watch('property_type_id');

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('property_type')
          .select('id, name')
          .order('name');

        if (error) throw error;
        setPropertyTypes(data || []);
      } catch (error) {
        console.error('Error fetching property types:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los tipos de propiedad.',
          variant: 'destructive',
        });
      }
    };

    const fetchBuildings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('building')
          .select('id, name')
          .eq('owner_id', user.id)
          .order('name');

        if (error) throw error;
        setBuildings(data || []);
      } catch (error) {
        console.error('Error fetching buildings:', error);
      }
    };

    if (isOpen) {
      fetchPropertyTypes();
      fetchBuildings();
      reset();
    }
  }, [user, isOpen, toast, reset]);

  const onSubmit = async (data: PropertyFormData) => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const propertyData = {
        owner_id: user.id,
        name: data.name.trim(),
        address: data.address.trim(),
        monthly_rent: Number(data.monthly_rent),
        property_type_id: data.property_type_id,
        building_id: data.building_id || null,
        active: true,
      };

      const { error } = await supabase
        .from('properties')
        .insert([propertyData]);

      if (error) throw error;

      toast({
        title: 'Propiedad agregada',
        description: 'La propiedad ha sido agregada exitosamente.',
      });

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar la propiedad. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPropertyTypeName = (id: string) => {
    const propertyType = propertyTypes.find(type => type.id === id);
    return propertyType?.name || 'Selecciona el tipo de propiedad';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500">
          <X className="h-4 w-4 text-gray-900" />
          <span className="sr-only">Cerrar</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900">
            Agregar Nueva Propiedad
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-900">
              Nombre de la Propiedad
            </Label>
            <Input
              id="name"
              placeholder="Ej: Departamento Centro 2B"
              {...register('name')}
              className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && (
              <p className="text-sm text-red-600 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-semibold text-gray-900">
              Dirección
            </Label>
            <Input
              id="address"
              placeholder="Ej: Av. Principal 123, Col. Centro"
              {...register('address')}
              className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.address && (
              <p className="text-sm text-red-600 font-medium">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthly_rent" className="text-sm font-semibold text-gray-900">
              Renta Mensual
            </Label>
            <Input
              id="monthly_rent"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              {...register('monthly_rent')}
              className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.monthly_rent ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.monthly_rent && (
              <p className="text-sm text-red-600 font-medium">{errors.monthly_rent.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="property_type_id" className="text-sm font-semibold text-gray-900">
              Tipo de Propiedad
            </Label>
            <Select 
              onValueChange={(value) => setValue('property_type_id', value)}
              value={selectedPropertyTypeId}
            >
              <SelectTrigger 
                className={`w-full bg-white text-gray-900 border ${errors.property_type_id ? 'border-red-500' : 'border-gray-300'}`}
              >
                <SelectValue placeholder="Selecciona el tipo de propiedad">
                  {selectedPropertyTypeId ? getPropertyTypeName(selectedPropertyTypeId) : 'Selecciona el tipo de propiedad'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent 
                className="bg-white border border-gray-200 shadow-lg"
                position="popper"
                sideOffset={8}
              >
                {propertyTypes.map((type) => (
                  <SelectItem 
                    key={type.id} 
                    value={type.id}
                    className="text-gray-900 hover:bg-gray-100 cursor-pointer"
                  >
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.property_type_id && (
              <p className="text-sm text-red-600 font-medium">{errors.property_type_id.message}</p>
            )}
          </div>

          {selectedPropertyTypeId && getPropertyTypeName(selectedPropertyTypeId) === 'Departamento' && buildings.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="building_id" className="text-sm font-semibold text-gray-900">
                Edificio (Opcional)
              </Label>
              <Select 
                onValueChange={(value) => setValue('building_id', value)}
              >
                <SelectTrigger className="w-full bg-white text-gray-900 border border-gray-300">
                  <SelectValue placeholder="Selecciona el edificio" />
                </SelectTrigger>
                <SelectContent 
                  className="bg-white border border-gray-200 shadow-lg"
                  position="popper"
                  sideOffset={8}
                >
                  {buildings.map((building) => (
                    <SelectItem 
                      key={building.id} 
                      value={building.id}
                      className="text-gray-900 hover:bg-gray-100 cursor-pointer"
                    >
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#4CAF50] hover:bg-[#3d9140] text-white font-semibold py-2.5"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Agregando...
              </>
            ) : (
              'Agregar Propiedad'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}