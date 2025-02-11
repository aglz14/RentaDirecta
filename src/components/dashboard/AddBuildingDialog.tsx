
import { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const buildingSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  address: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
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

type BuildingFormData = z.infer<typeof buildingSchema>;

interface AddBuildingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddBuildingDialog({ isOpen, onClose, onSuccess }: AddBuildingDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BuildingFormData>({
    resolver: zodResolver(buildingSchema),
  });

  const onSubmit = async (data: BuildingFormData) => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const buildingData = {
        owner_id: user.id,
        name: data.name.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        country: data.country.trim(),
      };

      const { error } = await supabase
        .from('building')
        .insert([buildingData]);

      if (error) throw error;

      toast({
        title: 'Edificio agregado',
        description: 'El edificio ha sido agregado exitosamente.',
      });

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding building:', error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar el edificio. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
            Agregar Nuevo Edificio
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-900">
              Nombre del Edificio
            </Label>
            <Input
              id="name"
              placeholder="Ej: Torre Centro"
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
              placeholder="Ej: Av. Principal 123"
              {...register('address')}
              className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.address && (
              <p className="text-sm text-red-600 font-medium">{errors.address.message}</p>
            )}
          </div>

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

          <Button
            type="submit"
            className="w-full bg-[#1B2956] hover:bg-[#141d3d] text-white font-semibold py-2.5"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Agregando...
              </>
            ) : (
              'Agregar Edificio'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
