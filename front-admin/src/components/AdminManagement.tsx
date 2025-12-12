import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Pencil, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { getAdmins, createAdmin, updateAdmin, Admin } from '../services/api';
import { toast } from 'sonner@2.0.3';

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      toast.error('Error al cargar administradores: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const adminData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as 'super-admin' | 'admin' | 'editor',
      status: 'active' as const,
      ...(editingAdmin ? {} : { password: formData.get('password') as string }),
    };

    try {
      if (editingAdmin) {
        const updated = await updateAdmin(editingAdmin.id, adminData);
        setAdmins(admins.map(admin => admin.id === editingAdmin.id ? updated : admin));
        toast.success('Administrador actualizado correctamente');
      } else {
        const created = await createAdmin(adminData as any);
        setAdmins([...admins, created]);
        toast.success('Administrador registrado correctamente');
      }
      setIsDialogOpen(false);
      setEditingAdmin(null);
    } catch (error) {
      toast.error('Error al guardar: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAdminStatus = async (id: string) => {
    const admin = admins.find(a => a.id === id);
    if (!admin) return;

    try {
      const newStatus = admin.status === 'active' ? 'inactive' : 'active';
      const updated = await updateAdmin(id, { status: newStatus });
      setAdmins(admins.map(a => a.id === id ? updated : a));
      toast.success(`Administrador ${newStatus === 'active' ? 'activado' : 'desactivado'}`);
    } catch (error) {
      toast.error('Error al cambiar estado: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const getRoleBadge = (role: Admin['role']) => {
    const labels: Record<Admin['role'], string> = {
      'super-admin': 'Super Admin',
      'admin': 'Administrador',
      'editor': 'Editor',
    };
    return <Badge variant="outline">{labels[role]}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Gestión de Administradores</h2>
          <p className="text-gray-500">Administra los usuarios del sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAdmin(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Registrar Administrador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAdmin ? 'Editar Administrador' : 'Registrar Nuevo Administrador'}</DialogTitle>
              <DialogDescription>
                {editingAdmin ? 'Modifica la información del administrador' : 'Ingresa los datos del nuevo administrador'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingAdmin?.name}
                  placeholder="Juan Pérez"
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={editingAdmin?.email}
                  placeholder="admin@etransa.com"
                  disabled={isSaving}
                  required
                />
              </div>
              {!editingAdmin && (
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    disabled={isSaving}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select name="role" defaultValue={editingAdmin?.role || 'editor'} disabled={isSaving}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  editingAdmin ? 'Guardar Cambios' : 'Registrar Administrador'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Administradores</CardTitle>
          <CardDescription>Total: {admins.length} administradores</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay administradores registrados
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{getRoleBadge(admin.role)}</TableCell>
                    <TableCell>{admin.createdAt}</TableCell>
                    <TableCell>
                      <Badge variant={admin.status === 'active' ? 'default' : 'destructive'}>
                        {admin.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingAdmin(admin);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAdminStatus(admin.id)}
                        >
                          {admin.status === 'active' ? 'Desactivar' : 'Activar'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
