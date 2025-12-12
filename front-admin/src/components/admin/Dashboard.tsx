import { useState, useEffect } from 'react';
import { Bus, Route, Users, Settings, LogOut, UserCircle } from 'lucide-react';
import { User } from '../../types';
import { BusManagement } from './BusManagement';
import { RouteManagement } from './RouteManagement';
import { DriverManagement } from './DriverManagement';
import { AdminManagement } from './AdminManagement';
import { Profile } from './Profile';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

type Tab = 'buses' | 'routes' | 'drivers' | 'admins' | 'profile';

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('buses');

  const canManageAdmins = user.role === 'admin';

  const tabs = [
    { id: 'buses' as Tab, label: 'Buses', icon: Bus },
    { id: 'routes' as Tab, label: 'Rutas', icon: Route },
    { id: 'drivers' as Tab, label: 'Choferes', icon: Users },
    ...(canManageAdmins ? [{ id: 'admins' as Tab, label: 'Administradores', icon: Settings }] : []),
    { id: 'profile' as Tab, label: 'Perfil', icon: UserCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500 p-2 rounded-lg">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-cyan-900">etransa</h1>
                <p className="text-gray-600">Panel de Administración</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-gray-900">{user.name}</p>
                <p className="text-gray-500">
                  {user.role === 'admin' ? 'Administrador' : 'Read Administrador'}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-cyan-500 text-cyan-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'buses' && <BusManagement />}
        {activeTab === 'routes' && <RouteManagement />}
        {activeTab === 'drivers' && <DriverManagement />}
        {activeTab === 'admins' && canManageAdmins && <AdminManagement />}
        {activeTab === 'profile' && <Profile user={user} />}
      </main>
    </div>
  );
}