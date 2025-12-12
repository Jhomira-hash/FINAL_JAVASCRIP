import { useState, useEffect } from 'react';
import { User, Driver, Bus } from '../../types';
import { driversApi, busesApi } from '../../services/api';
import { UserCircle, Mail, Phone, IdCard, Award, Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DriverProfileProps {
  user: User;
}

export function DriverProfile({ user }: DriverProfileProps) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [assignedBus, setAssignedBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    email: ''
  });

  useEffect(() => {
    loadDriverData();
  }, [user.driverId]);

  const loadDriverData = async () => {
    if (!user.driverId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const driverData = await driversApi.getById(user.driverId);
      setDriver(driverData);
      
      if (driverData) {
        setFormData({
          phone: driverData.phone,
          email: driverData.email
        });

        if (driverData.assignedBus) {
          const busData = await busesApi.getById(driverData.assignedBus);
          setAssignedBus(busData);
        }
      }
    } catch (error) {
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!driver) return;

    try {
      await driversApi.update(driver.id, {
        phone: formData.phone,
        email: formData.email
      });
      toast.success('Datos actualizados correctamente');
      setEditing(false);
      loadDriverData();
    } catch (error) {
      toast.error('Error al actualizar los datos');
    }
  };

  const handleCancel = () => {
    if (driver) {
      setFormData({
        phone: driver.phone,
        email: driver.email
      });
    }
    setEditing(false);
  };

  if (loading) {
    return <div className="text-center py-12">Cargando datos...</div>;
  }

  if (!driver) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">No se encontraron datos del chofer</p>
      </div>
    );
  }

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Mi Perfil</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Editar Datos
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Información Personal */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-6">Información Personal</h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <div className="bg-gray-100 p-3 rounded-lg">
                <UserCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 mb-1">Nombre Completo</p>
                <p className="text-gray-900">{driver.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <div className="bg-gray-100 p-3 rounded-lg">
                <IdCard className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 mb-1">Licencia de Conducir</p>
                <p className="text-gray-900">{driver.license}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Phone className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 mb-1">Teléfono</p>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                ) : (
                  <p className="text-gray-900">{driver.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 mb-1">Email</p>
                {editing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                ) : (
                  <p className="text-gray-900">{driver.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 mb-1">Experiencia</p>
                <p className="text-gray-900">{driver.experience} años</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <UserCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 mb-1">Estado</p>
                {getStatusBadge(driver.status)}
              </div>
            </div>
          </div>

          {editing && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                <Save className="w-5 h-5" />
                Guardar
              </button>
            </div>
          )}
        </div>

        {/* Bus Asignado */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-900 mb-6">Bus Asignado</h3>
          
          {assignedBus ? (
            <div className="space-y-4">
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                <p className="text-gray-600 mb-1">Placa</p>
                <p className="text-cyan-900">{assignedBus.plate}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 mb-1">Modelo</p>
                <p className="text-gray-900">{assignedBus.model}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 mb-1">Capacidad</p>
                <p className="text-gray-900">{assignedBus.capacity} pasajeros</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 mb-1">Año</p>
                <p className="text-gray-900">{assignedBus.year}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 mb-1">Estado del Bus</p>
                <span className={`inline-block px-3 py-1 rounded-full ${
                  assignedBus.status === 'active' ? 'bg-green-100 text-green-800' :
                  assignedBus.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {assignedBus.status === 'active' ? 'Activo' :
                   assignedBus.status === 'maintenance' ? 'En Mantenimiento' :
                   'Inactivo'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No tienes un bus asignado actualmente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
