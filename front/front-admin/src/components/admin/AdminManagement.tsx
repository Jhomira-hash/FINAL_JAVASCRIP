import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Admin } from '../../types';
import { adminsApi } from '../../services/api';
import { toast } from 'sonner@2.0.3';

export function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    role: 'readmin' as 'admin' | 'readmin'
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const data = await adminsApi.getAll();
      setAdmins(data);
    } catch (error) {
      toast.error('Error al cargar los administradores');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (admin?: Admin) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        name: admin.name,
        email: admin.email,
        username: admin.username,
        role: admin.role
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        name: '',
        email: '',
        username: '',
        role: 'readmin'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAdmin(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const adminData = {
      name: formData.name,
      email: formData.email,
      username: formData.username,
      role: formData.role
    };

    try {
      if (editingAdmin) {
        await adminsApi.update(editingAdmin.id, adminData);
        toast.success('Administrador actualizado correctamente');
      } else {
        await adminsApi.create(adminData);
        toast.success('Administrador creado correctamente');
      }
      handleCloseModal();
      loadAdmins();
    } catch (error) {
      toast.error('Error al guardar el administrador');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este administrador?')) return;
    
    try {
      await adminsApi.delete(id);
      toast.success('Administrador eliminado correctamente');
      loadAdmins();
    } catch (error) {
      toast.error('Error al eliminar el administrador');
    }
  };

  const getRoleBadge = (role: Admin['role']) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800',
      readmin: 'bg-blue-100 text-blue-800'
    };
    const labels = {
      admin: 'Administrador',
      readmin: 'Read Administrador'
    };
    return (
      <span className={`px-3 py-1 rounded-full ${styles[role]}`}>
        {labels[role]}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-12">Cargando administradores...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900">Gestión de Administradores</h2>
          <p className="text-gray-600 mt-1">Solo administradores pueden acceder a esta sección</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Administrador
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Nombre</th>
              <th className="px-6 py-3 text-left text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-gray-700">Usuario</th>
              <th className="px-6 py-3 text-left text-gray-700">Rol</th>
              <th className="px-6 py-3 text-left text-gray-700">Fecha de Creación</th>
              <th className="px-6 py-3 text-right text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900">{admin.name}</td>
                <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                <td className="px-6 py-4 text-gray-600">{admin.username}</td>
                <td className="px-6 py-4">{getRoleBadge(admin.role)}</td>
                <td className="px-6 py-4 text-gray-600">{admin.createdAt}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(admin)}
                      className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
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
                {editingAdmin ? 'Editar Administrador' : 'Nuevo Administrador'}
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
                <label className="block text-gray-700 mb-2">Usuario</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'readmin' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="admin">Administrador</option>
                  <option value="readmin">Read Administrador</option>
                </select>
                <p className="mt-1 text-gray-500">
                  {formData.role === 'admin' 
                    ? 'Acceso completo, incluyendo gestión de administradores' 
                    : 'Acceso completo excepto crear/editar/eliminar administradores'}
                </p>
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
                  {editingAdmin ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
