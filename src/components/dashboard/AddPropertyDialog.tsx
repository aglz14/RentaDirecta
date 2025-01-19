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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

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
  payment_scheme: z.enum(['subscription', 'flex'], {
    required_error: 'Selecciona un esquema de pago',
  }),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface AddPropertyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPropertyDialog({ isOpen, onClose, onSuccess }: AddPropertyDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      payment_scheme: undefined,
    }
  });

  const onSubmit = async (data: PropertyFormData) => {
    if (!user) return;

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('properties')
        .insert({
          owner_id: user.id,
          name: data.name.trim(),
          address: data.address.trim(),
          monthly_rent: Number(data.monthly_rent),
          payment_scheme: data.payment_scheme,
          active: true,
        });

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
            <Label htmlFor="payment_scheme" className="text-sm font-semibold text-gray-900">
              Esquema de Pago
            </Label>
            <Select
              onValueChange={(value: 'subscription' | 'flex') => setValue('payment_scheme', value)}
            >
              <SelectTrigger 
                className={`w-full bg-white text-gray-900 border ${errors.payment_scheme ? 'border-red-500' : 'border-gray-300'}`}
              >
                <SelectValue placeholder="Selecciona un esquema de pago" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem 
                  value="subscription" 
                  className="text-gray-900 hover:bg-gray-100 cursor-pointer focus:bg-gray-100 focus:text-gray-900"
                >
                  Suscripción
                </SelectItem>
                <SelectItem 
                  value="flex" 
                  className="text-gray-900 hover:bg-gray-100 cursor-pointer focus:bg-gray-100 focus:text-gray-900"
                >
                  Flex
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.payment_scheme && (
              <p className="text-sm text-red-600 font-medium">{errors.payment_scheme.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#00A86B] hover:bg-[#009060] text-white font-semibold py-2.5"
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