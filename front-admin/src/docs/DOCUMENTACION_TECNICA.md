# Documentación Técnica - Panel de Administración etransa

## Índice

1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Estructura de Archivos](#estructura-de-archivos)
4. [Componentes Principales](#componentes-principales)
5. [Capa de Servicios](#capa-de-servicios)
6. [Flujo de Autenticación](#flujo-de-autenticación)
7. [Gestión de Estado](#gestión-de-estado)
8. [Integración con API](#integración-con-api)

---

## Descripción General

Panel de administración web para la empresa de transporte **etransa**. Permite gestionar buses, rutas, choferes y administradores a través de una interfaz intuitiva conectada a una API REST.

### Tecnologías Utilizadas

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **Lucide React** - Iconos
- **Sonner** - Notificaciones toast

---

## Arquitectura

La aplicación sigue una arquitectura en capas:

```
┌─────────────────────────────────────┐
│     Componentes de Presentación    │
│  (Login, Dashboard, Management)     │
├─────────────────────────────────────┤
│      Componentes UI (shadcn)       │
│  (Button, Card, Table, Dialog)      │
├─────────────────────────────────────┤
│       Capa de Servicios API        │
│   (Lógica de comunicación HTTP)     │
├─────────────────────────────────────┤
│           API REST Backend          │
│    (Servidor con base de datos)     │
└─────────────────────────────────────┘
```

### Principios de Diseño

- **Separación de responsabilidades**: La lógica de negocio está en servicios separados
- **Reutilización**: Componentes UI modulares y reutilizables
- **Tipado fuerte**: TypeScript para prevenir errores en tiempo de compilación
- **UX optimizada**: Estados de carga, mensajes de error y confirmaciones

---

## Estructura de Archivos

```
/
├── App.tsx                    # Componente raíz
├── services/
│   └── api.ts                # Servicios de API REST
├── components/
│   ├── Login.tsx             # Pantalla de login
│   ├── Dashboard.tsx         # Layout principal
│   ├── BusManagement.tsx     # Gestión de buses
│   ├── RouteManagement.tsx   # Gestión de rutas
│   ├── DriverManagement.tsx  # Gestión de choferes
│   ├── AdminManagement.tsx   # Gestión de administradores
│   ├── Profile.tsx           # Perfil del usuario
│   └── ui/                   # Componentes UI de shadcn
└── styles/
    └── globals.css           # Estilos globales
```

---

## Componentes Principales

### App.tsx

**Propósito**: Componente raíz que maneja el estado de autenticación global.

```typescript
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica si existe un token guardado
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Renderiza Login o Dashboard según el estado
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return <Dashboard onLogout={() => setIsAuthenticated(false)} />;
}
```

**Responsabilidades**:
- Verificar autenticación al cargar la app
- Persistir sesión usando localStorage
- Renderizar Login o Dashboard condicionalmente
- Incluir el componente Toaster para notificaciones

---

### Login.tsx

**Propósito**: Pantalla de inicio de sesión.

**Flujo de autenticación**:
1. Usuario ingresa email y contraseña
2. Al enviar, se llama a `login()` del servicio API
3. Si es exitoso, se guarda el token en localStorage
4. Se ejecuta el callback `onLogin()` para actualizar el estado global
5. Si falla, se muestra un mensaje de error

**Estados**:
- `email`: Correo del usuario
- `password`: Contraseña
- `isLoading`: Indica si está procesando el login
- `error`: Mensaje de error en caso de fallo

**Características**:
- Validación de campos requeridos
- Deshabilitación de inputs durante carga
- Mensaje de error visible con Alert
- Feedback visual con spinner en el botón

---

### Dashboard.tsx

**Propósito**: Layout principal con navegación lateral.

**Estructura**:
```
┌────────────────────────────────────┐
│  Header (Logo + Cerrar Sesión)     │
├──────────┬─────────────────────────┤
│ Sidebar  │   Contenido Principal   │
│          │                         │
│ • Buses  │   <BusManagement />     │
│ • Rutas  │   <RouteManagement />   │
│ • Chofer │   <DriverManagement />  │
│ • Admins │   <AdminManagement />   │
│ • Perfil │   <Profile />           │
└──────────┴─────────────────────────┘
```

**Estados**:
- `activeTab`: Controla qué sección se muestra

**Funciones**:
- `handleLogout()`: Limpia el token y ejecuta callback de logout

---

### BusManagement.tsx

**Propósito**: CRUD completo de buses.

**Ciclo de vida**:
```
1. useEffect → loadBuses() → GET /buses → setBuses()
2. Usuario crea/edita → handleSubmit() → POST/PUT /buses → actualiza estado local
3. Éxito → cierra diálogo + muestra toast
```

**Estados**:
- `buses`: Array de buses cargados desde API
- `editingBus`: Bus seleccionado para editar (null si es nuevo)
- `isDialogOpen`: Controla visibilidad del diálogo de formulario
- `isLoading`: Indica carga inicial de datos
- `isSaving`: Indica si está guardando cambios

**Funciones clave**:
- `loadBuses()`: Obtiene buses desde la API
- `handleSubmit()`: Crea o actualiza un bus
- `getStatusBadge()`: Renderiza badge según estado del bus

**Modelo de datos**:
```typescript
interface Bus {
  id: string;
  plate: string;        // Placa
  model: string;        // Modelo
  capacity: number;     // Capacidad de pasajeros
  status: 'active' | 'maintenance' | 'inactive';
  year: number;         // Año de fabricación
}
```

---

### RouteManagement.tsx

**Propósito**: Gestión de rutas de transporte.

**Funcionalidad adicional**:
- `toggleRouteStatus()`: Activa/desactiva rutas sin eliminarlas

**Modelo de datos**:
```typescript
interface Route {
  id: string;
  name: string;         // Nombre de la ruta
  origin: string;       // Ciudad de origen
  destination: string;  // Ciudad de destino
  distance: number;     // Distancia en km
  duration: number;     // Duración en minutos
  price: number;        // Precio del pasaje
  status: 'active' | 'inactive';
}
```

---

### DriverManagement.tsx

**Propósito**: Gestión de choferes.

**Modelo de datos**:
```typescript
interface Driver {
  id: string;
  name: string;         // Nombre completo
  license: string;      // Número de licencia
  phone: string;        // Teléfono de contacto
  email: string;        // Correo electrónico
  status: 'active' | 'on-leave' | 'inactive';
  experience: number;   // Años de experiencia
}
```

---

### AdminManagement.tsx

**Propósito**: Registro y gestión de administradores del sistema.

**Características especiales**:
- El campo contraseña solo aparece al crear (no al editar)
- Permite activar/desactivar cuentas sin eliminarlas
- Diferentes roles: super-admin, admin, editor

**Modelo de datos**:
```typescript
interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'editor';
  status: 'active' | 'inactive';
  createdAt: string;    // Fecha de registro
}
```

---

### Profile.tsx

**Propósito**: Visualización y edición del perfil del usuario actual.

**Secciones**:
1. **Información personal**: Nombre, email, teléfono, rol
2. **Cambio de contraseña**: Formulario separado para actualizar contraseña

**Funciones**:
- `loadProfile()`: Obtiene datos del perfil desde GET /profile
- `handleSubmit()`: Actualiza nombre y teléfono
- `handlePasswordChange()`: Cambia la contraseña validando que coincidan

**Estados**:
- `isEditing`: Alterna entre vista y edición
- `isLoading`: Carga inicial de datos
- `isSaving`: Guardando cambios

---

## Capa de Servicios

### services/api.ts

**Propósito**: Centralizar toda la comunicación con la API REST.

### Configuración

```typescript
const API_BASE_URL = 'https://api.etransa.com/v1';
```

### Helpers

**handleResponse()**
```typescript
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      message: 'Error en la petición' 
    }));
    throw new Error(error.message || `Error: ${response.status}`);
  }
  return response.json();
}
```
- Maneja respuestas HTTP
- Lanza errores si status no es 2xx
- Parsea JSON automáticamente

**getAuthHeaders()**
```typescript
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}
```
- Incluye el token JWT en cada petición
- Añade headers necesarios

### Funciones de API

Cada recurso tiene operaciones CRUD completas:

#### Autenticación
```typescript
login(credentials) → POST /auth/login
logout() → Limpia localStorage
saveAuthData(data) → Guarda token y datos de usuario
getUserData() → Obtiene datos del usuario guardados
```

#### Buses
```typescript
getBuses() → GET /buses
createBus(bus) → POST /buses
updateBus(id, bus) → PUT /buses/:id
deleteBus(id) → DELETE /buses/:id
```

#### Rutas
```typescript
getRoutes() → GET /routes
createRoute(route) → POST /routes
updateRoute(id, route) → PUT /routes/:id
deleteRoute(id) → DELETE /routes/:id
```

#### Choferes
```typescript
getDrivers() → GET /drivers
createDriver(driver) → POST /drivers
updateDriver(id, driver) → PUT /drivers/:id
deleteDriver(id) → DELETE /drivers/:id
```

#### Administradores
```typescript
getAdmins() → GET /admins
createAdmin(admin) → POST /admins
updateAdmin(id, admin) → PUT /admins/:id
deleteAdmin(id) → DELETE /admins/:id
```

#### Perfil
```typescript
getProfile() → GET /profile
updateProfile(profile) → PUT /profile
changePassword(data) → PUT /profile/password
```

---

## Flujo de Autenticación

### 1. Login
```
Usuario → Email + Password
    ↓
Login.tsx → handleSubmit()
    ↓
api.login({ email, password })
    ↓
POST /auth/login
    ↓
Response: { token, user: { id, name, email, role } }
    ↓
saveAuthData() → localStorage.setItem('auth_token', token)
    ↓
onLogin() → setIsAuthenticated(true)
    ↓
App.tsx → Renderiza <Dashboard />
```

### 2. Peticiones Autenticadas
```
Componente → createBus(busData)
    ↓
fetch(API_BASE_URL + '/buses', {
  headers: getAuthHeaders() // Incluye: Authorization: Bearer {token}
})
    ↓
API Backend verifica token
    ↓
Response: Bus creado
```

### 3. Logout
```
Usuario → Click "Cerrar Sesión"
    ↓
handleLogout() → logout()
    ↓
localStorage.removeItem('auth_token')
localStorage.removeItem('user_data')
    ↓
onLogout() → setIsAuthenticated(false)
    ↓
App.tsx → Renderiza <Login />
```

### 4. Persistencia de Sesión
```
Usuario recarga página
    ↓
App.tsx → useEffect()
    ↓
const token = localStorage.getItem('auth_token')
    ↓
if (token) → setIsAuthenticated(true)
    ↓
Usuario permanece logueado
```

---

## Gestión de Estado

### Estado Local (useState)

Cada componente maneja su propio estado:

```typescript
const [data, setData] = useState<T[]>([]);      // Datos cargados
const [isLoading, setIsLoading] = useState(true); // Carga inicial
const [isSaving, setIsSaving] = useState(false);  // Guardando
const [editing, setEditing] = useState<T | null>(null); // Editando
const [isDialogOpen, setIsDialogOpen] = useState(false); // Diálogo
```

### Estado Global

El único estado global es la autenticación en `App.tsx`:
```typescript
const [isAuthenticated, setIsAuthenticated] = useState(false);
```

Se propaga mediante callbacks:
- `onLogin={() => setIsAuthenticated(true)}`
- `onLogout={() => setIsAuthenticated(false)}`

### Persistencia

**localStorage** se usa para:
- `auth_token`: Token JWT de autenticación
- `user_data`: Información básica del usuario (JSON)

---

## Integración con API

### Patrón de Carga de Datos

Todos los componentes de gestión siguen este patrón:

```typescript
export default function ManagementComponent() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await getDataFromAPI();
      setData(result);
    } catch (error) {
      toast.error('Error al cargar: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Table data={data} />
      )}
    </div>
  );
}
```

### Patrón de Guardado de Datos

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSaving(true);

  try {
    if (editing) {
      // Actualizar existente
      const updated = await updateItem(editing.id, formData);
      setData(data.map(item => item.id === editing.id ? updated : item));
      toast.success('Actualizado correctamente');
    } else {
      // Crear nuevo
      const created = await createItem(formData);
      setData([...data, created]);
      toast.success('Creado correctamente');
    }
    closeDialog();
  } catch (error) {
    toast.error('Error: ' + error.message);
  } finally {
    setIsSaving(false);
  }
};
```

### Manejo de Errores

**En la capa de servicios**:
```typescript
if (!response.ok) {
  throw new Error(error.message || `Error: ${response.status}`);
}
```

**En los componentes**:
```typescript
try {
  await apiCall();
  toast.success('Operación exitosa');
} catch (error) {
  toast.error('Error: ' + (error instanceof Error ? error.message : 'Error desconocido'));
}
```

### Notificaciones (Toast)

Se usa la librería **Sonner** para feedback visual:

```typescript
import { toast } from 'sonner@2.0.3';

// Éxito
toast.success('Bus creado correctamente');

// Error
toast.error('Error al cargar datos');

// Información
toast.info('Procesando solicitud...');
```

---

## Mejores Prácticas Implementadas

### 1. Tipado Fuerte
```typescript
// ✅ Interfaces bien definidas
interface Bus {
  id: string;
  plate: string;
  // ...
}

// ✅ Funciones tipadas
async function getBuses(): Promise<Bus[]> { }
```

### 2. Manejo de Estados de Carga
```typescript
// ✅ Feedback visual durante carga
{isLoading ? (
  <Loader2 className="animate-spin" />
) : (
  <Content />
)}

// ✅ Deshabilitar inputs durante guardado
<Input disabled={isSaving} />
<Button disabled={isSaving}>
  {isSaving ? 'Guardando...' : 'Guardar'}
</Button>
```

### 3. Separación de Responsabilidades
```typescript
// ✅ Lógica de API separada
import { getBuses, createBus } from '../services/api';

// ❌ NO hacer fetch directamente en componentes
fetch('/api/buses') // Evitar
```

### 4. Validación de Formularios
```typescript
// ✅ Validación HTML nativa
<Input required type="email" />

// ✅ Validación custom
if (newPassword !== confirmPassword) {
  toast.error('Las contraseñas no coinciden');
  return;
}
```

### 5. Optimización de Renders
```typescript
// ✅ useEffect con dependencias vacías para carga inicial
useEffect(() => {
  loadData();
}, []); // Solo se ejecuta una vez
```

---

## Configuración del Backend

Para que la aplicación funcione correctamente, el backend debe:

1. **Implementar autenticación JWT**
2. **Retornar respuestas en formato JSON**
3. **Usar códigos HTTP estándar** (200, 201, 400, 401, 404, 500)
4. **Soportar CORS** para peticiones desde el frontend
5. **Implementar los endpoints** documentados en `/README_API.md`

### Ejemplo de Respuesta del Backend

**Éxito (200)**:
```json
{
  "id": "123",
  "plate": "ABC-123",
  "model": "Mercedes-Benz O500",
  "capacity": 45,
  "status": "active",
  "year": 2023
}
```

**Error (400)**:
```json
{
  "message": "La placa ya está registrada"
}
```

---

## Extensiones Futuras

Posibles mejoras al sistema:

1. **Paginación**: Para tablas con muchos registros
2. **Búsqueda y filtros**: Encontrar datos rápidamente
3. **Exportación**: Descargar reportes en PDF/Excel
4. **Gráficos**: Estadísticas de uso de buses y rutas
5. **Notificaciones en tiempo real**: WebSockets para actualizaciones
6. **Roles y permisos**: Control de acceso granular por funcionalidad
7. **Historial de cambios**: Auditoría de modificaciones
8. **Multi-idioma**: Soporte para varios idiomas

---

## Solución de Problemas Comunes

### Error: "Failed to fetch"
- Verificar que el backend esté corriendo
- Verificar la URL en `API_BASE_URL`
- Revisar configuración de CORS en el backend

### Error: "401 Unauthorized"
- Token expirado → Implementar refresh token
- Token inválido → Hacer logout y login nuevamente

### Datos no se actualizan
- Verificar que `loadData()` se llame después de crear/actualizar
- Revisar que el estado local se actualice correctamente

### Toast no aparece
- Verificar que `<Toaster />` esté en `App.tsx`
- Importar correctamente: `import { toast } from 'sonner@2.0.3'`

---

## Conclusión

Esta aplicación implementa un panel de administración completo y robusto siguiendo las mejores prácticas de React y TypeScript. La arquitectura modular facilita el mantenimiento y la extensión de funcionalidades futuras.
