import { useState } from 'react';
import { Toaster } from 'sonner@2.0.3';
import { Login } from './components/Login';
import { Dashboard } from './components/admin/Dashboard';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <>
      {user.role === 'driver' ? (
        <DriverDashboard user={user} onLogout={handleLogout} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
      <Toaster position="top-right" richColors />
    </>
  );
}
