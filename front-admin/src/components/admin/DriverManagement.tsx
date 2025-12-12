import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Driver, Bus } from '../../types';
import { driversApi, busesApi } from '../../services/api';
import { toast } from 'sonner@2.0.3';

export function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    license: '',
    phone: '',
    email: '',
    experience: '',
    status: 'active' as Driver['status'],
    assignedBus: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [driversData, busesData] = await Promise.all([
        driversApi.getAll(),
        busesApi.getAll()
      ]);
      setDrivers(driversData);
      setBuses(busesData);
    } catch (error) {
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (driver?: Driver) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData({
        name: driver.name,
        license: driver.license,
        phone: driver.phone,
        email: driver.email,
        experience: driver.experience.toString(),
        status: driver.status,
        assignedBus: driver.assignedBus || ''
      });
    } else {
      setEditingDriver(null);
      setFormData({
        name: '',
        license: '',
        phone: '',
        email: '',
        experience: '',
        status: 'active',
        assignedBus: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDriver(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const driverData = {
      name: formData.name,
      license: formData.license,
      phone: formData.phone,
      email: formData.email,
      experience: parseInt(formData.experience),
      status: formData.status,
      assignedBus: formData.assignedBus || undefined
    };

    try {
      if (editingDriver) {
        await driversApi.update(editingDriver.id, driverData);
        toast.success('Chofer actualizado correctamente');
      } else {
        await driversApi.create(driverData);
        toast.success('Chofer creado correctamente');
      }
      handleCloseModal();
      loadData();
    } catch (error) {
      toast.error('Error al guardar el chofer');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este chofer?')) return;
    
    try {
      await driversApi.delete(id);
      toast.success('Chofer eliminado correctamente');
      loadData();
    } catch (error) {
      toast.error('Error al eliminar el chofer');
    }
  };

  const getStatusBadge = (status: Driver['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800'
    };
    const labels = {
      active: 'Activo',
      inactive: 'Inactivo'
    };
    return (
      <span className={`px-3 py-1 rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getBusPlate = (busId?: string) => {
    if (!busId) return '-';
    const bus = buses.find(b => b.id === busId);
    return bus ? bus.plate : '-';
  };

  if (loading) {
    return <div className="text-center py-12">Cargando choferes...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Gestión de Choferes</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Chofer
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Nombre</th>
              <th className="px-6 py-3 text-left text-gray-700">Licencia</th>
              <th className="px-6 py-3 text-left text-gray-700">Teléfono</th>
              <th className="px-6 py-3 text-left text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-gray-700">Experiencia</th>
              <th className="px-6 py-3 text-left text-gray-700">Bus Asignado</th>
              <th className="px-6 py-3 text-left text-gray-700">Estado</th>
              <th className="px-6 py-3 text-right text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {drivers.map((driver) => (
              <tr key={driver.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900">{driver.name}</td>
                <td className="px-6 py-4 text-gray-600">{driver.license}</td>
                <td className="px-6 py-4 text-gray-600">{driver.phone}</td>
                <td className="px-6 py-4 text-gray-600">{driver.email}</td>
                <td className="px-6 py-4 text-gray-600">{driver.experience} años</td>
                <td className="px-6 py-4 text-gray-600">{getBusPlate(driver.assignedBus)}</td>
                <td className="px-6 py-4">{getStatusBadge(driver.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(driver)}
                      className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(driver.id)}
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
                {editingDriver ? 'Editar Chofer' : 'Nuevo Chofer'}
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
                <label className="block text-gray-700 mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Licencia</label>
                <input
                  type="text"
                  value={formData.license}
                  onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Experiencia (años)</label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Bus Asignado (opcional)</label>
                <select
                  value={formData.assignedBus}
                  onChange={(e) => setFormData({ ...formData, assignedBus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Sin asignar</option>
                  {buses.filter(b => b.status === 'active').map((bus) => (
                    <option key={bus.id} value={bus.id}>
                      {bus.plate} - {bus.model}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Estado</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Driver['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="active">Activo</option>
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
                  {editingDriver ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
