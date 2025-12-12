import { User } from '../../types';
import { UserCircle, Mail, Shield } from 'lucide-react';

interface ProfileProps {
  user: User;
}

export function Profile({ user }: ProfileProps) {
  return (
    <div>
      <h2 className="text-gray-900 mb-6">Mi Perfil</h2>
      
      <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="bg-cyan-100 p-6 rounded-full">
            <UserCircle className="w-20 h-20 text-cyan-600" />
          </div>
          <div>
            <h3 className="text-gray-900">{user.name}</h3>
            <p className="text-gray-600 mt-1">
              {user.role === 'admin' ? 'Administrador' : 'Read Administrador'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
            <div className="bg-gray-100 p-3 rounded-lg">
              <UserCircle className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-600 mb-1">Usuario</p>
              <p className="text-gray-900">{user.username}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Mail className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-600 mb-1">Email</p>
              <p className="text-gray-900">{user.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-600 mb-1">Rol</p>
              <p className="text-gray-900">
                {user.role === 'admin' ? 'Administrador' : 'Read Administrador'}
              </p>
              <p className="text-gray-500 mt-2">
                {user.role === 'admin' 
                  ? 'Tienes acceso completo a todas las funcionalidades del sistema, incluyendo la gestión de administradores.' 
                  : 'Tienes acceso a todas las funcionalidades excepto la gestión de administradores.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
