import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const signUpSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Correo electrónico inválido'),
  whatsapp: z.string()
    .min(10, 'El número debe tener al menos 10 dígitos')
    .regex(/^[0-9]+$/, 'Solo se permiten números'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSuccess: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      
      // 1. Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signUpError) throw signUpError;

      // 2. Create profile immediately after successful signup
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: data.email,
              first_name: data.firstName,
              last_name: data.lastName,
              whatsapp: data.whatsapp,
            },
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Try to delete the auth user if profile creation fails
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw new Error('Error creating profile');
        }

        toast({
          title: '¡Cuenta creada!',
          description: 'Tu cuenta ha sido creada exitosamente.',
        });
        onSuccess();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear la cuenta. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            Nombre
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Diego"
            {...register('firstName')}
            className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Apellido
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Bonilla"
            {...register('lastName')}
            className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-signup" className="text-sm font-medium text-gray-700">
          Correo Electrónico
        </Label>
        <Input
          id="email-signup"
          type="email"
          placeholder="tu@email.com"
          {...register('email')}
          className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-700">
          WhatsApp
        </Label>
        <Input
          id="whatsapp"
          type="tel"
          placeholder="8112345678"
          {...register('whatsapp')}
          className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.whatsapp ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.whatsapp && (
          <p className="text-sm text-red-500">{errors.whatsapp.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-signup" className="text-sm font-medium text-gray-700">
          Contraseña
        </Label>
        <Input
          id="password-signup"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          className={`bg-white text-gray-900 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          Confirmar Contraseña
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          className={`bg-white text-gray-900 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          'Crear Cuenta'
        )}
      </Button>
    </form>
  );
}