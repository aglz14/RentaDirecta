import { Plus, Mail, Apple as WhatsApp, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const users = [
  {
    id: '1',
    name: 'Carlos Ramírez',
    role: 'Administrador',
    email: 'carlos.ramirez@example.com',
    whatsapp: '8112345678'
  },
  {
    id: '2',
    name: 'Ana López',
    role: 'Propietario',
    email: 'ana.lopez@example.com',
    whatsapp: '8187654321'
  },
  {
    id: '3',
    name: 'Roberto García',
    role: 'Mantenimiento',
    email: 'roberto.garcia@example.com',
    whatsapp: '8198765432'
  }
];

export function BuildingUsers() {
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEdit = (userId: string) => {
    // TODO: Implement edit functionality
    toast({
      title: "Editar Usuario",
      description: "Funcionalidad de edición en desarrollo",
    });
  };

  const handleDelete = (userId: string) => {
    setUserToDelete(userId);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;

    // TODO: Implement actual delete functionality
    toast({
      title: "Usuario Eliminado",
      description: "El usuario ha sido eliminado exitosamente",
    });
    setUserToDelete(null);
  };

  const openWhatsApp = (whatsapp: string) => {
    window.open(`https://wa.me/52${whatsapp}`, '_blank');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Usuarios</CardTitle>
        <Button className="bg-[#4CAF50] hover:bg-[#3d9140]">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Usuario
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <a 
                    href={`mailto:${user.email}`}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email}
                  </a>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    className="flex items-center text-green-600 hover:text-green-800 hover:bg-green-50"
                    onClick={() => openWhatsApp(user.whatsapp)}
                  >
                    <WhatsApp className="h-4 w-4 mr-2" />
                    {user.whatsapp}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      onClick={() => handleEdit(user.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El usuario será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}