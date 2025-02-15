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

const unitSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  property_type_id: z.string({
    required_error: 'El tipo de propiedad es requerido',
  }),
  building_id: z.string().optional(),
  owner_name: z.string().min(3, 'El nombre del propietario es requerido'),
  owner_email: z.string().email('Email inválido'),
  monthly_rent: z.string()
    .min(1, 'La renta es requerida')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'La renta debe ser un número mayor a 0',
    }),
  currency: z.string().min(1, 'La moneda es requerida'),
  street: z.string().min(5, 'La calle debe tener al menos 5 caracteres'),
  unit_number: z.string().min(1, 'El número de unidad es requerido'),
  neighborhood: z.string().min(3, 'La colonia debe tener al menos 3 caracteres'),
  zip_code: z.string().min(5, 'El código postal debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  state: z.string().min(2, 'El estado debe tener al menos 2 caracteres'),
  country: z.string().min(2, 'El país debe tener al menos 2 caracteres'),
});

type UnitFormData = z.infer<typeof unitSchema>;

interface Building {
  id: string;
  name: string;
}

interface PropertyType {
  id: string;
  name: string;
}

interface AddUnitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddUnitDialog({ isOpen, onClose, onSuccess }: AddUnitDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
  });

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
          description: 'No se pudieron cargar los tipos de propiedad',
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

  const onSubmit = async (data: UnitFormData) => {
    if (!user) return;

    try {
      setIsLoading(true);

      const unitData = {
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
        owner_name: data.owner_name.trim(),
        owner_email: data.owner_email.trim(),
      };

      const { error } = await supabase
        .from('properties')
        .insert([unitData]);

      if (error) throw error;

      toast({
        title: 'Unidad agregada',
        description: 'La unidad ha sido agregada exitosamente.',
      });

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding unit:', error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar la unidad. Por favor, intenta de nuevo.',
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
            Agregar Nueva Unidad
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Ej: Oficina 101"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_type_id">Tipo de Propiedad</Label>
              <Select onValueChange={(value) => setValue('property_type_id', value)}>
                <SelectTrigger className={errors.property_type_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona el tipo" />
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
                <p className="text-sm text-red-500">{errors.property_type_id.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="building_id">Inmueble (Opcional)</Label>
            <Select onValueChange={(value) => setValue('building_id', value)}>
              <SelectTrigger>
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
              <Label htmlFor="owner_name">Nombre del Propietario</Label>
              <Input
                id="owner_name"
                {...register('owner_name')}
                className={errors.owner_name ? 'border-red-500' : ''}
              />
              {errors.owner_name && (
                <p className="text-sm text-red-500">{errors.owner_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner_email">Email del Propietario</Label>
              <Input
                id="owner_email"
                type="email"
                {...register('owner_email')}
                className={errors.owner_email ? 'border-red-500' : ''}
              />
              {errors.owner_email && (
                <p className="text-sm text-red-500">{errors.owner_email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly_rent">Renta Mensual</Label>
              <Input
                id="monthly_rent"
                type="number"
                {...register('monthly_rent')}
                className={errors.monthly_rent ? 'border-red-500' : ''}
              />
              {errors.monthly_rent && (
                <p className="text-sm text-red-500">{errors.monthly_rent.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select onValueChange={(value) => setValue('currency', value)}>
                <SelectTrigger className={errors.currency ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona la moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                  <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                </SelectContent>
              </Select>
              {errors.currency && (
                <p className="text-sm text-red-500">{errors.currency.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="street">Calle</Label>
              <Input
                id="street"
                {...register('street')}
                className={errors.street ? 'border-red-500' : ''}
              />
              {errors.street && (
                <p className="text-sm text-red-500">{errors.street.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_number">Número de Unidad</Label>
              <Input
                id="unit_number"
                {...register('unit_number')}
                className={errors.unit_number ? 'border-red-500' : ''}
              />
              {errors.unit_number && (
                <p className="text-sm text-red-500">{errors.unit_number.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Colonia</Label>
              <Input
                id="neighborhood"
                {...register('neighborhood')}
                className={errors.neighborhood ? 'border-red-500' : ''}
              />
              {errors.neighborhood && (
                <p className="text-sm text-red-500">{errors.neighborhood.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip_code">Código Postal</Label>
              <Input
                id="zip_code"
                {...register('zip_code')}
                className={errors.zip_code ? 'border-red-500' : ''}
              />
              {errors.zip_code && (
                <p className="text-sm text-red-500">{errors.zip_code.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                {...register('city')}
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                {...register('state')}
                className={errors.state ? 'border-red-500' : ''}
              />
              {errors.state && (
                <p className="text-sm text-red-500">{errors.state.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                {...register('country')}
                className={errors.country ? 'border-red-500' : ''}
              />
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#4CAF50] hover:bg-[#3d9140]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Agregando...
              </>
            ) : (
              'Agregar Unidad'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}