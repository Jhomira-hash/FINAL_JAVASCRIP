export type UserRole = 'admin' | 'readmin' | 'driver';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: UserRole;
  driverId?: string; // Solo para role 'driver'
}

export interface Bus {
  id: string;
  plate: string;
  model: string;
  capacity: number;
  status: 'active' | 'maintenance' | 'inactive';
  year: number;
}

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  fare: number;
  status: 'active' | 'inactive';
}

export interface Driver {
  id: string;
  name: string;
  license: string;
  phone: string;
  email: string;
  experience: number;
  status: 'active' | 'inactive';
  assignedBus?: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  username: string;
  role: 'admin' | 'readmin';
  createdAt: string;
}
