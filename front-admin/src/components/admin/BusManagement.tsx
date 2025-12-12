import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Bus } from '../../types';
import { busesApi } from '../../services/api';
import { toast } from 'sonner@2.0.3';

export function BusManagement() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [formData, setFormData] = useState({
    plate: '',
    model: '',
    capacity: '',
    status: 'active' as Bus['status'],
    year: ''
  });

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    setLoading(true);
    try {
      const data = await busesApi.getAll();
      setBuses(data);
    } catch (error) {
      toast.error('Error al cargar los buses');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (bus?: Bus) => {
    if (bus) {
      setEditingBus(bus);
      setFormData({
        plate: bus.plate,
        model: bus.model,
        capacity: bus.capacity.toString(),
        status: bus.status,
        year: bus.year.toString()
      });
    } else {
      setEditingBus(null);
      setFormData({
        plate: '',
        model: '',
        capacity: '',
        status: 'active',
        year: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const busData = {
      plate: formData.plate,
      model: formData.model,
      capacity: parseInt(formData.capacity),
      status: formData.status,
      year: parseInt(formData.year)
    };

    try {
      if (editingBus) {
        await busesApi.update(editingBus.id, busData);
        toast.success('Bus actualizado correctamente');
      } else {
        await busesApi.create(busData);
        toast.success('Bus creado correctamente');
      }
      handleCloseModal();
      loadBuses();
    } catch (error) {
      toast.error('Error al guardar el bus');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este bus?')) return;
    
    try {
      await busesApi.delete(id);
      toast.success('Bus eliminado correctamente');
      loadBuses();
    } catch (error) {
      toast.error('Error al eliminar el bus');
    }
  };

  const getStatusBadge = (status: Bus['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-red-100 text-red-800'
    };
    const labels = {
      active: 'Activo',
      maintenance: 'Mantenimiento',
      inactive: 'Inactivo'
    };
    return (
      <span className={`px-3 py-1 rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-12">Cargando buses...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Gestión de Buses</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Bus
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Placa</th>
              <th className="px-6 py-3 text-left text-gray-700">Modelo</th>
              <th className="px-6 py-3 text-left text-gray-700">Capacidad</th>
              <th className="px-6 py-3 text-left text-gray-700">Año</th>
              <th className="px-6 py-3 text-left text-gray-700">Estado</th>
              <th className="px-6 py-3 text-right text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {buses.map((bus) => (
              <tr key={bus.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900">{bus.plate}</td>
                <td className="px-6 py-4 text-gray-600">{bus.model}</td>
                <td className="px-6 py-4 text-gray-600">{bus.capacity} pasajeros</td>
                <td className="px-6 py-4 text-gray-600">{bus.year}</td>
                <td className="px-6 py-4">{getStatusBadge(bus.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(bus)}
                      className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(bus.id)}
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
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-gray-900">
                {editingBus ? 'Editar Bus' : 'Nuevo Bus'}
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
                <label className="block text-gray-700 mb-2">Placa</label>
                <input
                  type="text"
                  value={formData.plate}
                  onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Modelo</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Capacidad</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Año</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                  min="2000"
                  max="2030"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Estado</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Bus['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="active">Activo</option>
                  <option value="maintenance">Mantenimiento</option>
                  <option value="inactive">Inactivo</option>
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
                  {editingBus ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}