import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const buildingSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  building_type: z.string({
    required_error: "El tipo de inmueble es requerido",
  }),
  street: z
    .string()
    .min(5, "La calle debe tener al menos 5 caracteres")
    .max(200, "La calle no puede exceder 200 caracteres"),
  exterior_number: z
    .string()
    .min(1, "El número exterior es requerido")
    .max(20, "El número exterior no puede exceder 20 caracteres"),
  interior_number: z
    .string()
    .max(20, "El número interior no puede exceder 20 caracteres")
    .optional(),
  neighborhood: z
    .string()
    .min(3, "La colonia debe tener al menos 3 caracteres")
    .max(100, "La colonia no puede exceder 100 caracteres"),
  zip_code: z
    .string()
    .min(5, "El código postal debe tener al menos 5 caracteres")
    .max(10, "El código postal no puede exceder 10 caracteres"),
  city: z
    .string()
    .min(2, "La ciudad debe tener al menos 2 caracteres")
    .max(100, "La ciudad no puede exceder 100 caracteres"),
  state: z
    .string()
    .min(2, "El estado debe tener al menos 2 caracteres")
    .max(100, "El estado no puede exceder 100 caracteres"),
  country: z
    .string()
    .min(2, "El país debe tener al menos 2 caracteres")
    .max(100, "El país no puede exceder 100 caracteres"),
});

type BuildingFormData = z.infer<typeof buildingSchema>;

interface AddBuildingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddBuildingDialog({
  isOpen,
  onClose,
  onSuccess,
}: AddBuildingDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [buildingTypes, setBuildingTypes] = useState<
    Array<{ id: number; name: string; value: string }>
  >([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBuildingTypes = async () => {
      try {
        const { data, error } = await supabase
          .from("public.building_types")
          .select("*")
          .order("name");

        if (error) {
          console.error("Supabase error:", error);
          toast({
            title: "Error",
            description: "No se pudieron cargar los tipos de inmuebles",
            variant: "destructive",
          });
          return;
        }

        if (!data || data.length === 0) {
          console.warn("No building types found");
          return;
        }

        setBuildingTypes(data);
      } catch (error) {
        console.error("Error fetching building types:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los tipos de inmuebles.",
          variant: "destructive",
        });
      }
    };

    fetchBuildingTypes();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BuildingFormData>({
    resolver: zodResolver(buildingSchema),
  });

  const onSubmit = async (data: BuildingFormData) => {
    if (!user) return;

    try {
      setIsLoading(true);

      const address = `${data.street} ${data.exterior_number}${data.interior_number ? ` Int. ${data.interior_number}` : ""}, ${data.neighborhood}, ${data.zip_code}`;

      const buildingData = {
        owner_id: user.id,
        name: data.name.trim(),
        building_type: data.building_type,
        street: data.street.trim(),
        exterior_number: data.exterior_number.trim(),
        interior_number: data.interior_number?.trim() || null,
        neighborhood: data.neighborhood.trim(),
        zip_code: data.zip_code.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        country: data.country.trim(),
        address: `${data.street.trim()} ${data.exterior_number.trim()}${data.interior_number ? ` Int. ${data.interior_number.trim()}` : ""}, ${data.neighborhood.trim()}, ${data.zip_code.trim()}`,
      };

      const { error } = await supabase.from("building").insert([buildingData]);

      if (error) throw error;

      toast({
        title: "Edificio agregado",
        description: "El edificio ha sido agregado exitosamente.",
      });

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding building:", error);
      toast({
        title: "Error",
        description:
          "No se pudo agregar el edificio. Por favor, intenta de nuevo.",
        variant: "destructive",
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
            Agregar Nuevo Inmueble
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-gray-900"
              >
                Nombre del Edificio
              </Label>
              <Input
                id="name"
                placeholder="Ej: Torre Centro"
                {...register("name")}
                className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.name && (
                <p className="text-sm text-red-600 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="building_type"
                className="text-sm font-semibold text-gray-900"
              >
                Tipo de Inmueble
              </Label>
              <Select
                onValueChange={(value) => setValue("building_type", value)}
              >
                <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  {buildingTypes.map((type) => (
                    <SelectItem key={type.id} value={type.value}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.building_type && (
                <p className="text-sm text-red-600 font-medium">
                  {errors.building_type.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="street"
                className="text-sm font-semibold text-gray-900"
              >
                Calle
              </Label>
              <Input
                id="street"
                placeholder="Ej: Av. Principal"
                {...register("street")}
                className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.street ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.street && (
                <p className="text-sm text-red-600 font-medium">
                  {errors.street.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label
                  htmlFor="exterior_number"
                  className="text-sm font-semibold text-gray-900"
                >
                  Número Ext.
                </Label>
                <Input
                  id="exterior_number"
                  placeholder="123"
                  {...register("exterior_number")}
                  className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.exterior_number ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.exterior_number && (
                  <p className="text-sm text-red-600 font-medium">
                    {errors.exterior_number.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="interior_number"
                  className="text-sm font-semibold text-gray-900"
                >
                  Número Int.
                </Label>
                <Input
                  id="interior_number"
                  placeholder="Opcional"
                  {...register("interior_number")}
                  className="bg-white text-gray-900 placeholder:text-gray-500 border-gray-300"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="neighborhood"
                className="text-sm font-semibold text-gray-900"
              >
                Colonia
              </Label>
              <Input
                id="neighborhood"
                placeholder="Ej: Centro"
                {...register("neighborhood")}
                className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.neighborhood ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.neighborhood && (
                <p className="text-sm text-red-600 font-medium">
                  {errors.neighborhood.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="zip_code"
                className="text-sm font-semibold text-gray-900"
              >
                Código Postal
              </Label>
              <Input
                id="zip_code"
                placeholder="Ej: 64000"
                {...register("zip_code")}
                className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.zip_code ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.zip_code && (
                <p className="text-sm text-red-600 font-medium">
                  {errors.zip_code.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="city"
                className="text-sm font-semibold text-gray-900"
              >
                Ciudad
              </Label>
              <Input
                id="city"
                placeholder="Ej: Monterrey"
                {...register("city")}
                className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.city ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.city && (
                <p className="text-sm text-red-600 font-medium">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="state"
                className="text-sm font-semibold text-gray-900"
              >
                Estado
              </Label>
              <Input
                id="state"
                placeholder="Ej: Nuevo León"
                {...register("state")}
                className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.state ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.state && (
                <p className="text-sm text-red-600 font-medium">
                  {errors.state.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="country"
                className="text-sm font-semibold text-gray-900"
              >
                País
              </Label>
              <Input
                id="country"
                placeholder="Ej: México"
                {...register("country")}
                className={`bg-white text-gray-900 placeholder:text-gray-500 ${errors.country ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.country && (
                <p className="text-sm text-red-600 font-medium">
                  {errors.country.message}
                </p>
              )}
            </div>
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
              "Agregar Edificio"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
