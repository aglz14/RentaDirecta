
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface BuildingUser {
  id: string;
  role: string;
  full_name: string;
  email: string;
  whatsapp: string;
}

export function BuildingUsers() {
  const { id: buildingId } = useParams();
  const { user } = useAuth();
  const [users, setUsers] = useState<BuildingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!buildingId || !user) return;

      try {
        setIsLoading(true);
        
        // First check if current user is the owner
        const { data: buildingData, error: buildingError } = await supabase
          .from('buildings')
          .select('owner_id')
          .eq('id', buildingId)
          .single();

        if (buildingError) throw buildingError;
        
        const isOwner = buildingData.owner_id === user.id;
        setIsOwner(isOwner);

        if (!isOwner) {
          setUsers([]);
          return;
        }

        // Then fetch users if owner
        const { data, error } = await supabase
          .from('building_users')
          .select('id, role, full_name, email, whatsapp')
          .eq('building', buildingId);

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching building users:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los usuarios del edificio.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [buildingId, user, toast]);

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

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const { error } = await supabase
        .from('building_users')
        .delete()
        .eq('id', userToDelete);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== userToDelete));
      toast({
        title: "Usuario Eliminado",
        description: "El usuario ha sido eliminado exitosamente",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    } finally {
      setUserToDelete(null);
    }
  };

  const openWhatsApp = (whatsapp: string) => {
    window.open(`https://wa.me/52${whatsapp}`, '_blank');
  };

  if (!isOwner) {
    return null;
  }

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
              <TableHead>Acciones</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(user.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    onClick={() => openWhatsApp(user.whatsapp)}
                    className="p-0 h-auto font-normal"
                  >
                    {user.whatsapp}
                  </Button>
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
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
