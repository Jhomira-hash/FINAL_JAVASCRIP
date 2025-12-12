import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Route } from '../../types';
import { routesApi } from '../../services/api';
import { toast } from 'sonner@2.0.3';

export function RouteManagement() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    destination: '',
    distance: '',
    duration: '',
    fare: '',
    status: 'active' as Route['status']
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const data = await routesApi.getAll();
      setRoutes(data);
    } catch (error) {
      toast.error('Error al cargar las rutas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (route?: Route) => {
    if (route) {
      setEditingRoute(route);
      setFormData({
        name: route.name,
        origin: route.origin,
        destination: route.destination,
        distance: route.distance.toString(),
        duration: route.duration.toString(),
        fare: route.fare.toString(),
        status: route.status
      });
    } else {
      setEditingRoute(null);
      setFormData({
        name: '',
        origin: '',
        destination: '',
        distance: '',
        duration: '',
        fare: '',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRoute(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const routeData = {
      name: formData.name,
      origin: formData.origin,
      destination: formData.destination,
      distance: parseFloat(formData.distance),
      duration: parseFloat(formData.duration),
      fare: parseFloat(formData.fare),
      status: formData.status
    };

    try {
      if (editingRoute) {
        await routesApi.update(editingRoute.id, routeData);
        toast.success('Ruta actualizada correctamente');
      } else {
        await routesApi.create(routeData);
        toast.success('Ruta creada correctamente');
      }
      handleCloseModal();
      loadRoutes();
    } catch (error) {
      toast.error('Error al guardar la ruta');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta ruta?')) return;
    
    try {
      await routesApi.delete(id);
      toast.success('Ruta eliminada correctamente');
      loadRoutes();
    } catch (error) {
      toast.error('Error al eliminar la ruta');
    }
  };

  const getStatusBadge = (status: Route['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800'
    };
    const labels = {
      active: 'Activa',
      inactive: 'Inactiva'
    };
    return (
      <span className={`px-3 py-1 rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-12">Cargando rutas...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Gestión de Rutas</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Ruta
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Nombre</th>
              <th className="px-6 py-3 text-left text-gray-700">Origen</th>
              <th className="px-6 py-3 text-left text-gray-700">Destino</th>
              <th className="px-6 py-3 text-left text-gray-700">Distancia</th>
              <th className="px-6 py-3 text-left text-gray-700">Duración</th>
              <th className="px-6 py-3 text-left text-gray-700">Tarifa</th>
              <th className="px-6 py-3 text-left text-gray-700">Estado</th>
              <th className="px-6 py-3 text-right text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {routes.map((route) => (
              <tr key={route.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900">{route.name}</td>
                <td className="px-6 py-4 text-gray-600">{route.origin}</td>
                <td className="px-6 py-4 text-gray-600">{route.destination}</td>
                <td className="px-6 py-4 text-gray-600">{route.distance} km</td>
                <td className="px-6 py-4 text-gray-600">{route.duration} hrs</td>
                <td className="px-6 py-4 text-gray-600">S/ {route.fare}</td>
                <td className="px-6 py-4">{getStatusBadge(route.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(route)}
                      className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(route.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-gray-900">
                {editingRoute ? 'Editar Ruta' : 'Nueva Ruta'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nombre de Ruta</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Origen</label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Destino</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Distancia (km)</label>
                <input
                  type="number"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Duración (horas)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                  min="0"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Tarifa (S/)</label>
                <input
                  type="number"
                  value={formData.fare}
                  onChange={(e) => setFormData({ ...formData, fare: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Estado</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Route['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="active">Activa</option>
                  <option value="inactive">Inactiva</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  {editingRoute ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
