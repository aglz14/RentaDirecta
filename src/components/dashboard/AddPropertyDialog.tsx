import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const propertySchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  property_type_id: z.string({
    required_error: 'El tipo de propiedad es requerido',
  }),
  building_id: z.string().optional(),
  monthly_rent: z.string()
    .min(1, 'La renta mensual es requerida')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'La renta debe ser un número mayor a 0',
    }),
  currency: z.string({
    required_error: 'La moneda es requerida',
  }).min(1, 'La moneda es requerida'),
  street: z.string()
    .min(5, 'La calle debe tener al menos 5 caracteres')
    .max(200, 'La calle no puede exceder 200 caracteres'),
  unit_number: z.string()
    .min(1, 'El número de unidad es requerido')
    .max(20, 'El número no puede exceder 20 caracteres'),
  neighborhood: z.string()
    .min(3, 'La colonia debe tener al menos 3 caracteres')
    .max(100, 'La colonia no puede exceder 100 caracteres'),
  zip_code: z.string()
    .min(5, 'El código postal debe tener al menos 5 caracteres')
    .max(10, 'El código postal no puede exceder 10 caracteres'),
  city: z.string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no puede exceder 100 caracteres'),
  state: z.string()
    .min(2, 'El estado debe tener al menos 2 caracteres')
    .max(100, 'El estado no puede exceder 100 caracteres'),
  country: z.string()
    .min(2, 'El país debe tener al menos 2 caracteres')
    .max(100, 'El país no puede exceder 100 caracteres'),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyType {
  id: string;
  name: string;
}

interface Building {
  id: string;
  name: string;
}

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
  
  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      currency: 'MXN'
    }
  });

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('property_types')
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
          .from('buildings')
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
        property_type_id: data.property_type_id,
        building_id: data.building_id || null,
        monthly_rent: Number(data.monthly_rent),
        currency: data.currency,
        street: data.street.trim(),
        unit_number: data.unit_number.trim(),
        neighborhood: data.neighborhood.trim(),
        zip_code: data.zip_code.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        country: data.country.trim(),
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
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
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="property_type_id" className="text-sm font-semibold text-gray-900">
                Tipo de Propiedad
              </Label>
              <Select onValueChange={(value) => setValue('property_type_id', value)}>
                <SelectTrigger className={`bg-white text-gray-900 border ${errors.property_type_id ? 'border-red-500' : 'border-gray-300'}`}>
                  <SelectValue placeholder="Selecciona el tipo de propiedad" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.property_type_id && (
                <p className="text-sm text-red-600 font-medium">{errors.property_type_id.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="building_id" className="text-sm font-semibold text-gray-900">
              Inmueble (Opcional)
            </Label>
            <Select onValueChange={(value) => setValue('building_id', value)}>
              <SelectTrigger className="bg-white text-gray-900 border border-gray-300">
                <SelectValue placeholder="Selecciona el inmueble" />
              </SelectTrigger>
              <SelectContent>
                {buildings.map((building) => (
                  <SelectItem key={building.id} value={building.id}>
                    {building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly_rent" className="text-sm font-semibold text-gray-900">
                Renta Mensual
              </Label>
              <div className="flex gap-2">
                <Input
                  id="monthly_rent"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  {...register('monthly_rent')}
                  className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.monthly_rent ? 'border-red-500' : 'border-gray-300'}`}
                />
                <Select 
                  defaultValue="MXN"
                  onValueChange={(value) => setValue('currency', value)}
                >
                  <SelectTrigger className="w-[100px] bg-white text-gray-900 border border-gray-300">
                    <SelectValue placeholder="MXN" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MXN">MXN</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.monthly_rent && (
                <p className="text-sm text-red-600 font-medium">{errors.monthly_rent.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="street" className="text-sm font-semibold text-gray-900">
                Calle
              </Label>
              <Input
                id="street"
                placeholder="Ej: Av. Principal"
                {...register('street')}
                className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.street && (
                <p className="text-sm text-red-600 font-medium">{errors.street.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_number" className="text-sm font-semibold text-gray-900">
                Número de Unidad
              </Label>
              <Input
                id="unit_number"
                placeholder="Ej: 2B"
                {...register('unit_number')}
                className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.unit_number ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.unit_number && (
                <p className="text-sm text-red-600 font-medium">{errors.unit_number.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="neighborhood" className="text-sm font-semibold text-gray-900">
                Colonia
              </Label>
              <Input
                id="neighborhood"
                placeholder="Ej: Centro"
                {...register('neighborhood')}
                className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.neighborhood ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.neighborhood && (
                <p className="text-sm text-red-600 font-medium">{errors.neighborhood.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip_code" className="text-sm font-semibold text-gray-900">
                Código Postal
              </Label>
              <Input
                id="zip_code"
                placeholder="Ej: 64000"
                {...register('zip_code')}
                className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.zip_code ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.zip_code && (
                <p className="text-sm text-red-600 font-medium">{errors.zip_code.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-semibold text-gray-900">
                Ciudad
              </Label>
              <Input
                id="city"
                placeholder="Ej: Monterrey"
                {...register('city')}
                className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.city && (
                <p className="text-sm text-red-600 font-medium">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-semibold text-gray-900">
                Estado
              </Label>
              <Input
                id="state"
                placeholder="Ej: Nuevo León"
                {...register('state')}
                className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.state && (
                <p className="text-sm text-red-600 font-medium">{errors.state.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-semibold text-gray-900">
                País
              </Label>
              <Input
                id="country"
                placeholder="Ej: México"
                {...register('country')}
                className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.country && (
                <p className="text-sm text-red-600 font-medium">{errors.country.message}</p>
              )}
            </div>
          </div>

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