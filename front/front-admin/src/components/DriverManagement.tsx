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
import { getDrivers, createDriver, updateDriver, Driver } from '../services/api';
import { toast } from 'sonner@2.0.3';

export default function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setIsLoading(true);
    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch (error) {
      toast.error('Error al cargar choferes: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const driverData = {
      name: formData.get('name') as string,
      license: formData.get('license') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      status: formData.get('status') as 'active' | 'on-leave' | 'inactive',
      experience: parseInt(formData.get('experience') as string),
    };

    try {
      if (editingDriver) {
        const updated = await updateDriver(editingDriver.id, driverData);
        setDrivers(drivers.map(driver => driver.id === editingDriver.id ? updated : driver));
        toast.success('Chofer actualizado correctamente');
      } else {
        const created = await createDriver(driverData);
        setDrivers([...drivers, created]);
        toast.success('Chofer creado correctamente');
      }
      setIsDialogOpen(false);
      setEditingDriver(null);
    } catch (error) {
      toast.error('Error al guardar: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: Driver['status']) => {
    const variants: Record<Driver['status'], { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      active: { variant: 'default', label: 'Activo' },
      'on-leave': { variant: 'secondary', label: 'De Permiso' },
      inactive: { variant: 'destructive', label: 'Inactivo' },
    };
    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Gestión de Choferes</h2>
          <p className="text-gray-500">Administra el personal de conducción</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingDriver(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Chofer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDriver ? 'Editar Chofer' : 'Agregar Nuevo Chofer'}</DialogTitle>
              <DialogDescription>
                {editingDriver ? 'Modifica la información del chofer' : 'Ingresa los datos del nuevo chofer'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingDriver?.name}
                  placeholder="Carlos Méndez"
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">Licencia</Label>
                <Input
                  id="license"
                  name="license"
                  defaultValue={editingDriver?.license}
                  placeholder="DL-12345"
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={editingDriver?.phone}
                    placeholder="+1234567890"
                    disabled={isSaving}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Años de Experiencia</Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    defaultValue={editingDriver?.experience}
                    placeholder="5"
                    disabled={isSaving}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={editingDriver?.email}
                  placeholder="chofer@etransa.com"
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select name="status" defaultValue={editingDriver?.status || 'active'} disabled={isSaving}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="on-leave">De Permiso</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
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
                  editingDriver ? 'Guardar Cambios' : 'Agregar Chofer'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Choferes</CardTitle>
          <CardDescription>Total: {drivers.length} choferes</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : drivers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay choferes registrados
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Licencia</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Experiencia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell>{driver.name}</TableCell>
                    <TableCell>{driver.license}</TableCell>
                    <TableCell>{driver.phone}</TableCell>
                    <TableCell>{driver.email}</TableCell>
                    <TableCell>{driver.experience} años</TableCell>
                    <TableCell>{getStatusBadge(driver.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingDriver(driver);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
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
