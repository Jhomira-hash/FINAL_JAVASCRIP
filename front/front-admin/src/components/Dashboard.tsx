import { useState } from 'react';
import { Button } from './ui/button';
import { Bus, Users, Route, UserCog, UserCircle, LogOut } from 'lucide-react';
import AdminManagement from './AdminManagement';
import BusManagement from './BusManagement';
import RouteManagement from './RouteManagement';
import DriverManagement from './DriverManagement';
import Profile from './Profile';
import { logout } from '../services/api';

interface DashboardProps {
  onLogout: () => void;
}

type Tab = 'buses' | 'routes' | 'drivers' | 'admins' | 'profile';

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('buses');

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">etransa</h1>
                <p className="text-gray-500 text-sm">Panel de Administración</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] p-4">
          <nav className="space-y-1">
            <Button
              variant={activeTab === 'buses' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('buses')}
            >
              <Bus className="w-4 h-4 mr-2" />
              Buses
            </Button>
            <Button
              variant={activeTab === 'routes' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('routes')}
            >
              <Route className="w-4 h-4 mr-2" />
              Rutas
            </Button>
            <Button
              variant={activeTab === 'drivers' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('drivers')}
            >
              <Users className="w-4 h-4 mr-2" />
              Choferes
            </Button>
            <Button
              variant={activeTab === 'admins' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('admins')}
            >
              <UserCog className="w-4 h-4 mr-2" />
              Administradores
            </Button>
            <Button
              variant={activeTab === 'profile' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('profile')}
            >
              <UserCircle className="w-4 h-4 mr-2" />
              Mi Perfil
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'buses' && <BusManagement />}
          {activeTab === 'routes' && <RouteManagement />}
          {activeTab === 'drivers' && <DriverManagement />}
          {activeTab === 'admins' && <AdminManagement />}
          {activeTab === 'profile' && <Profile />}
        </main>
      </div>
    </div>
  );
}
