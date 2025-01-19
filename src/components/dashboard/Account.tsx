import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, validateWhatsApp } from '@/lib/supabase';

const accountSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  whatsapp: z.string().min(10, 'El número debe tener al menos 10 dígitos')
    .regex(/^[0-9]+$/, 'Solo se permiten números'),
  email: z.string().email('Correo electrónico inválido'),
});

type AccountFormData = z.infer<typeof accountSchema>;

export function Account() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, profile, loading } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      whatsapp: profile?.whatsapp || '',
      email: profile?.email || '',
    },
  });

  const onSubmit = async (data: AccountFormData) => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Validate WhatsApp number
      if (!validateWhatsApp(data.whatsapp)) {
        throw new Error('El formato del número de WhatsApp es inválido');
      }

      // Update profile in Supabase
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          whatsapp: data.whatsapp,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: 'Perfil actualizado',
        description: 'Tu información ha sido actualizada exitosamente.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo actualizar el perfil. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A86B]" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">
          Por favor, inicia sesión para acceder a esta página.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cuenta</h1>
        <p className="mt-2 text-gray-600">
          Administra tu información personal y preferencias
        </p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Información Personal</CardTitle>
            <CardDescription className="text-gray-600">
              Actualiza tus datos de contacto y perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700">Nombre</Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700">Apellido</Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled
                  className="bg-gray-50 text-gray-600"
                />
                <p className="text-sm text-gray-500">
                  El correo electrónico no se puede modificar
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-gray-700">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  {...register('whatsapp')}
                  className={errors.whatsapp ? 'border-red-500' : ''}
                />
                {errors.whatsapp && (
                  <p className="text-sm text-red-500">{errors.whatsapp.message}</p>
                )}
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={isLoading} className="w-full bg-[#00A86B] hover:bg-[#009060] text-white">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}