import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Pencil, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { getRoutes, createRoute, updateRoute, Route } from '../services/api';
import { toast } from 'sonner@2.0.3';

export default function RouteManagement() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    setIsLoading(true);
    try {
      const data = await getRoutes();
      setRoutes(data);
    } catch (error) {
      toast.error('Error al cargar rutas: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const routeData = {
      name: formData.get('name') as string,
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      distance: parseFloat(formData.get('distance') as string),
      duration: parseInt(formData.get('duration') as string),
      price: parseFloat(formData.get('price') as string),
      status: 'active' as const,
    };

    try {
      if (editingRoute) {
        const updated = await updateRoute(editingRoute.id, routeData);
        setRoutes(routes.map(route => route.id === editingRoute.id ? updated : route));
        toast.success('Ruta actualizada correctamente');
      } else {
        const created = await createRoute(routeData);
        setRoutes([...routes, created]);
        toast.success('Ruta creada correctamente');
      }
      setIsDialogOpen(false);
      setEditingRoute(null);
    } catch (error) {
      toast.error('Error al guardar: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRouteStatus = async (id: string) => {
    const route = routes.find(r => r.id === id);
    if (!route) return;

    try {
      const newStatus = route.status === 'active' ? 'inactive' : 'active';
      const updated = await updateRoute(id, { status: newStatus });
      setRoutes(routes.map(r => r.id === id ? updated : r));
      toast.success(`Ruta ${newStatus === 'active' ? 'activada' : 'desactivada'}`);
    } catch (error) {
      toast.error('Error al cambiar estado: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Gestión de Rutas</h2>
          <p className="text-gray-500">Administra las rutas de transporte</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingRoute(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Ruta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRoute ? 'Editar Ruta' : 'Agregar Nueva Ruta'}</DialogTitle>
              <DialogDescription>
                {editingRoute ? 'Modifica la información de la ruta' : 'Ingresa los datos de la nueva ruta'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Ruta</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingRoute?.name}
                  placeholder="Ruta Norte"
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origen</Label>
                  <Input
                    id="origin"
                    name="origin"
                    defaultValue={editingRoute?.origin}
                    placeholder="Ciudad A"
                    disabled={isSaving}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destino</Label>
                  <Input
                    id="destination"
                    name="destination"
                    defaultValue={editingRoute?.destination}
                    placeholder="Ciudad B"
                    disabled={isSaving}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distancia (km)</Label>
                  <Input
                    id="distance"
                    name="distance"
                    type="number"
                    step="0.1"
                    defaultValue={editingRoute?.distance}
                    placeholder="250"
                    disabled={isSaving}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración (min)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    defaultValue={editingRoute?.duration}
                    placeholder="180"
                    disabled={isSaving}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={editingRoute?.price}
                  placeholder="25.00"
                  disabled={isSaving}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  editingRoute ? 'Guardar Cambios' : 'Agregar Ruta'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Rutas</CardTitle>
          <CardDescription>Total: {routes.length} rutas</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : routes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay rutas registradas
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Origen</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Distancia</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell>{route.name}</TableCell>
                    <TableCell>{route.origin}</TableCell>
                    <TableCell>{route.destination}</TableCell>
                    <TableCell>{route.distance} km</TableCell>
                    <TableCell>{route.duration} min</TableCell>
                    <TableCell>${route.price}</TableCell>
                    <TableCell>
                      <Badge variant={route.status === 'active' ? 'default' : 'secondary'}>
                        {route.status === 'active' ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingRoute(route);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRouteStatus(route.id)}
                        >
                          {route.status === 'active' ? 'Desactivar' : 'Activar'}
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
