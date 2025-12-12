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
import { getBuses, createBus, updateBus, Bus } from '../services/api';
import { toast } from 'sonner@2.0.3';

export default function BusManagement() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    setIsLoading(true);
    try {
      const data = await getBuses();
      setBuses(data);
    } catch (error) {
      toast.error('Error al cargar buses: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const busData = {
      plate: formData.get('plate') as string,
      model: formData.get('model') as string,
      capacity: parseInt(formData.get('capacity') as string),
      status: formData.get('status') as 'active' | 'maintenance' | 'inactive',
      year: parseInt(formData.get('year') as string),
    };

    try {
      if (editingBus) {
        const updated = await updateBus(editingBus.id, busData);
        setBuses(buses.map(bus => bus.id === editingBus.id ? updated : bus));
        toast.success('Bus actualizado correctamente');
      } else {
        const created = await createBus(busData);
        setBuses([...buses, created]);
        toast.success('Bus creado correctamente');
      }
      setIsDialogOpen(false);
      setEditingBus(null);
    } catch (error) {
      toast.error('Error al guardar: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: Bus['status']) => {
    const variants: Record<Bus['status'], { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      active: { variant: 'default', label: 'Activo' },
      maintenance: { variant: 'secondary', label: 'Mantenimiento' },
      inactive: { variant: 'destructive', label: 'Inactivo' },
    };
    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Gestión de Buses</h2>
          <p className="text-gray-500">Administra la flota de vehículos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingBus(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Bus
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBus ? 'Editar Bus' : 'Agregar Nuevo Bus'}</DialogTitle>
              <DialogDescription>
                {editingBus ? 'Modifica la información del bus' : 'Ingresa los datos del nuevo bus'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plate">Placa</Label>
                <Input
                  id="plate"
                  name="plate"
                  defaultValue={editingBus?.plate}
                  placeholder="ABC-123"
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Input
                  id="model"
                  name="model"
                  defaultValue={editingBus?.model}
                  placeholder="Mercedes-Benz O500"
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacidad</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    defaultValue={editingBus?.capacity}
                    placeholder="45"
                    disabled={isSaving}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Año</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    defaultValue={editingBus?.year}
                    placeholder="2023"
                    disabled={isSaving}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select name="status" defaultValue={editingBus?.status || 'active'} disabled={isSaving}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
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
                  editingBus ? 'Guardar Cambios' : 'Agregar Bus'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Buses</CardTitle>
          <CardDescription>Total: {buses.length} buses</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : buses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay buses registrados
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buses.map((bus) => (
                  <TableRow key={bus.id}>
                    <TableCell>{bus.plate}</TableCell>
                    <TableCell>{bus.model}</TableCell>
                    <TableCell>{bus.capacity} pasajeros</TableCell>
                    <TableCell>{bus.year}</TableCell>
                    <TableCell>{getStatusBadge(bus.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingBus(bus);
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
