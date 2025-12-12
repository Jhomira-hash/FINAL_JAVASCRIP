import { User, Bus, Route, Driver, Admin } from '../types';

// Usuarios dummy para pruebas
export const DUMMY_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Juan Pérez',
    email: 'admin@etransa.com',
    role: 'admin'
  },
  {
    id: '2',
    username: 'readmin',
    password: 'readmin123',
    name: 'María García',
    email: 'readmin@etransa.com',
    role: 'readmin'
  },
  {
    id: '3',
    username: 'chofer',
    password: 'chofer123',
    name: 'Carlos Rodríguez',
    email: 'carlos@etransa.com',
    role: 'driver',
    driverId: 'd1'
  }
];

// Datos dummy
let dummyBuses: Bus[] = [
  { id: 'b1', plate: 'ABC-123', model: 'Mercedes-Benz O500', capacity: 45, status: 'active', year: 2022 },
  { id: 'b2', plate: 'DEF-456', model: 'Volvo 9800', capacity: 50, status: 'active', year: 2023 },
  { id: 'b3', plate: 'GHI-789', model: 'Scania K410', capacity: 42, status: 'maintenance', year: 2021 }
];

let dummyRoutes: Route[] = [
  { id: 'r1', name: 'Ruta Lima-Arequipa', origin: 'Lima', destination: 'Arequipa', distance: 1010, duration: 16, fare: 80, status: 'active' },
  { id: 'r2', name: 'Ruta Lima-Cusco', origin: 'Lima', destination: 'Cusco', distance: 1100, duration: 20, fare: 100, status: 'active' },
  { id: 'r3', name: 'Ruta Arequipa-Puno', origin: 'Arequipa', destination: 'Puno', distance: 300, duration: 5, fare: 40, status: 'active' }
];

let dummyDrivers: Driver[] = [
  { id: 'd1', name: 'Carlos Rodríguez', license: 'A-II-123456', phone: '987654321', email: 'carlos@etransa.com', experience: 8, status: 'active', assignedBus: 'b1' },
  { id: 'd2', name: 'Pedro Sánchez', license: 'A-II-234567', phone: '987654322', email: 'pedro@etransa.com', experience: 5, status: 'active', assignedBus: 'b2' },
  { id: 'd3', name: 'Luis Martínez', license: 'A-II-345678', phone: '987654323', email: 'luis@etransa.com', experience: 10, status: 'inactive' }
];

let dummyAdmins: Admin[] = [
  { id: '1', name: 'Juan Pérez', email: 'admin@etransa.com', username: 'admin', role: 'admin', createdAt: '2024-01-15' },
  { id: '2', name: 'María García', email: 'readmin@etransa.com', username: 'readmin', role: 'readmin', createdAt: '2024-02-20' }
];

// Configuración de la API
const API_BASE_URL = 'http://localhost:8080/api'; // Cambia esto a tu URL de API
const USE_DUMMY_DATA = false; // Cambia a false cuando tengas el backend listo

// Helper para simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper para simular llamadas a API
async function apiCall<T>(
  endpoint: string,
  dummyData: T,
  options?: RequestInit
): Promise<T> {
  if (USE_DUMMY_DATA) {
    await delay(500); // Simula latencia de red
    return dummyData;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('API call failed, using dummy data:', error);
    await delay(500);
    return dummyData;
  }
}

// Auth API
export const authApi = {
  login: async (username: string, password: string): Promise<User | null> => {
    if (USE_DUMMY_DATA) {
      await delay(500);
      const user = DUMMY_USERS.find(
        u => u.username === username && u.password === password
      );
      return user || null;
    }

    try {
      console.log("👉 Enviando al backend:", {
  correo: username,
  contrasena: password
});

      const response = await fetch(`${API_BASE_URL}/administrador/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: username,        // Mapeo correcto
          contrasena: password
        })
      });
            console.log("👉 Status backend:", response.status);

      if (!response.ok) return null;
      return await response.text();
    } catch (error) {
      console.warn('Login failed, using dummy data:', error);
      await delay(500);

      // fallback con dummy data usando username/password
      const user = DUMMY_USERS.find(
        u => u.username === username && u.password === password
      );

      return user || null;
      
    }
    
    
  }
  
};


// Buses API
export const busesApi = {
  getAll: () => apiCall('/buses', dummyBuses),
  
  getById: (id: string) => apiCall(`/buses/${id}`, dummyBuses.find(b => b.id === id) || null),
  
  create: async (bus: Omit<Bus, 'id'>) => {
    if (USE_DUMMY_DATA) {
      await delay(500);
      const newBus = { ...bus, id: `b${Date.now()}` };
      dummyBuses.push(newBus);
      return newBus;
    }
    return apiCall('/buses', bus, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bus)
    });
  },
  
  update: async (id: string, bus: Partial<Bus>) => {
    if (USE_DUMMY_DATA) {
      await delay(500);
      const index = dummyBuses.findIndex(b => b.id === id);
      if (index !== -1) {
        dummyBuses[index] = { ...dummyBuses[index], ...bus };
        return dummyBuses[index];
      }
      return null;
    }
    return apiCall(`/buses/${id}`, bus, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bus)
    });
  },
  
  delete: async (id: string) => {
    if (USE_DUMMY_DATA) {
      await delay(500);
      dummyBuses = dummyBuses.filter(b => b.id !== id);
      return true;
    }
    return apiCall(`/buses/${id}`, true, { method: 'DELETE' });
  }
};

// Routes API
export const routesApi = {
  getAll: () => apiCall('/routes', dummyRoutes),
  
  getById: (id: string) => apiCall(`/routes/${id}`, dummyRoutes.find(r => r.id === id) || null),
  
  create: async (route: Omit<Route, 'id'>) => {
    if (USE_DUMMY_DATA) {
      await delay(500);
      const newRoute = { ...route, id: `r${Date.now()}` };
      dummyRoutes.push(newRoute);
      return newRoute;
    }
    return apiCall('/routes', route, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(route)
    });
  },
  
  update: async (id: string, route: Partial<Route>) => {
    if (USE_DUMMY_DATA) {
      await delay(500);
      const index = dummyRoutes.findIndex(r => r.id === id);
      if (index !== -1) {
        dummyRoutes[index] = { ...dummyRoutes[index], ...route };
        return dummyRoutes[index];
      }
      return null;
    }
    return apiCall(`/routes/${id}`, route, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(route)
    });
  },
  
  delete: async (id: string) => {
    if (USE_DUMMY_DATA) {
      await delay(500);
      dummyRoutes = dummyRoutes.filter(r => r.id !== id);
      return true;
    }
    return apiCall(`/routes/${id}`, true, { method: 'DELETE' });
  }
};

// Drivers API
export const driversApi = {
  getAll: () => apiCall('/drivers', dummyDrivers),
  
  getById: (id: string) => apiCall(`/drivers/${id}`, dummyDrivers.find(d => d.id === id) || null),
  
  create: async (driver: Omit<Driver, 'id'>) => {
    if (USE_DUMMY_DATA) {
      await delay(500);
      const newDriver = { ...driver, id: `d${Date.now()}` };
      dummyDrivers.push(newDriver);
      return newDriver;
    }
    return apiCall('/drivers', driver, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driver)
    });
  },
  
  update: async (id: string, driver: Partial<Driver>) => {
    if (USE_DUMMY_DATA) {
      await delay(500);
      const index = dummyDrivers.findIndex(d => d.id === id);
      if (index !== -1) {
        dummyDrivers[index] = { ...dummyDrivers[index], ...driver };
        return dummyDrivers[index];
      }
      return null;
    }
    return apiCall(`/drivers/${id}`, driver, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driver)
    });
  },
  
  delete: async (id: string) => {
    if (USE_DUMMY_DATA) {
      await delay(500);
      dummyDrivers = dummyDrivers.filter(d => d.id !== id);
      return true;
    }
    return apiCall(`/drivers/${id}`, true, { method: 'DELETE' });
  }
};

// Admins API
export const adminsApi = {
  getAll: () => apiCall('/admins', dummyAdmins),
  
  getById: (id: string) => apiCall(`/admins/${id}`, dummyAdmins.find(a => a.id === id) || null),
  
  create: async (admin: Omit<Admin, 'id' | 'createdAt'>) => {
    if (USE_DUMMY_DATA) {
      await delay(500);
      const newAdmin = {
        ...admin,
        id: `a${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      dummyAdmins.push(newAdmin);
      return newAdmin;
    }
    return apiCall('/admins', admin, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(admin)
    });
  },
  
  update: async (id: string, admin: Partial<Admin>) => {
    if (USE_DUMMY_DATA) {
      await delay(500);
      const index = dummyAdmins.findIndex(a => a.id === id);
      if (index !== -1) {
        dummyAdmins[index] = { ...dummyAdmins[index], ...admin };
        return dummyAdmins[index];
      }
      return null;
    }
    return apiCall(`/admins/${id}`, admin, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(admin)
    });
  },
  
  delete: async (id: string) => {
    if (USE_DUMMY_DATA) {
      await delay(500);
      dummyAdmins = dummyAdmins.filter(a => a.id !== id);
      return true;
    }
    return apiCall(`/admins/${id}`, true, { method: 'DELETE' });
  }
};
