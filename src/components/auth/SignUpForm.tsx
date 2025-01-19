import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { supabase, isSupabaseConfigured, validateWhatsApp, validateEmail } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const signUpSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Correo electrónico inválido'),
  whatsapp: z.string()
    .min(10, 'El número debe tener al menos 10 dígitos')
    .regex(/^[0-9]+$/, 'Solo se permiten números'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  userType: z.enum(['propietario', 'inquilino'], {
    required_error: 'Por favor selecciona un tipo de usuario',
  }),
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
  const { refreshProfile } = useAuth();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userType: undefined,
    }
  });

  const userType = watch('userType');

  const onSubmit = async (data: SignUpFormData) => {
    try {
      if (!isSupabaseConfigured()) {
        toast({
          title: 'Error de Configuración',
          description: 'Por favor, conecta tu proyecto a Supabase primero.',
          variant: 'destructive',
        });
        return;
      }

      // Validate email and WhatsApp
      if (!validateEmail(data.email)) {
        throw new Error('El formato del correo electrónico es inválido.');
      }

      if (!validateWhatsApp(data.whatsapp)) {
        throw new Error('El formato del número de WhatsApp es inválido.');
      }

      setIsLoading(true);
      
      // Step 1: Sign up the user with metadata
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            whatsapp: data.whatsapp,
            user_type: data.userType,
          }
        }
      });

      if (signUpError) {
        let errorMessage = 'No se pudo crear la cuenta. ';
        
        switch (signUpError.message) {
          case 'User already registered':
            errorMessage += 'Este correo ya está registrado.';
            break;
          case 'Password should be at least 6 characters':
            errorMessage += 'La contraseña debe tener al menos 6 caracteres.';
            break;
          default:
            errorMessage += 'Por favor, verifica tus datos e intenta de nuevo.';
        }

        throw new Error(errorMessage);
      }

      if (authData.user) {
        // Step 2: Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Step 3: Update profile data directly
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            first_name: data.firstName,
            last_name: data.lastName,
            whatsapp: data.whatsapp,
            user_type: data.userType,
          })
          .eq('id', authData.user.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          throw new Error('No se pudo actualizar el perfil. Por favor, intenta de nuevo.');
        }

        // Step 4: Refresh profile data in context
        await refreshProfile(authData.user.id);

        toast({
          title: '¡Cuenta creada!',
          description: 'Tu cuenta ha sido creada exitosamente.',
        });
        onSuccess();
      } else {
        throw new Error('No se pudo crear la cuenta. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo crear la cuenta. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="userType" className="text-sm font-medium text-gray-700">
          Tipo de Usuario
        </Label>
        <Select
          onValueChange={(value: 'propietario' | 'inquilino') => setValue('userType', value)}
          value={userType}
        >
          <SelectTrigger className={`bg-white text-gray-900 ${errors.userType ? 'border-red-500' : 'border-gray-300'}`}>
            <SelectValue placeholder="Selecciona tu tipo de usuario" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200">
            <SelectItem value="propietario" className="text-gray-900 hover:bg-gray-100">Propietario</SelectItem>
            <SelectItem value="inquilino" className="text-gray-900 hover:bg-gray-100">Inquilino</SelectItem>
          </SelectContent>
        </Select>
        {errors.userType && (
          <p className="text-sm text-red-500">{errors.userType.message}</p>
        )}
      </div>

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