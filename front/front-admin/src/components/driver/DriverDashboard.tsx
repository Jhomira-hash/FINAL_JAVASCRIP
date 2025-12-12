import { useState } from 'react';
import { Bus, LogOut, UserCircle } from 'lucide-react';
import { User } from '../../types';
import { DriverProfile } from './DriverProfile';

interface DriverDashboardProps {
  user: User;
  onLogout: () => void;
}

export function DriverDashboard({ user, onLogout }: DriverDashboardProps) {
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
                <p className="text-gray-600">Portal del Chofer</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-gray-900">{user.name}</p>
                <p className="text-gray-500">Chofer</p>
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

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DriverProfile user={user} />
      </main>
    </div>
  );
}
