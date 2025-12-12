# Guía de Componentes - Panel etransa

## Índice de Componentes

1. [App.tsx](#apptsx)
2. [Login.tsx](#logintsx)
3. [Dashboard.tsx](#dashboardtsx)
4. [BusManagement.tsx](#busmanagementtsx)
5. [RouteManagement.tsx](#routemanagementtsx)
6. [DriverManagement.tsx](#drivermanagementtsx)
7. [AdminManagement.tsx](#adminmanagementtsx)
8. [Profile.tsx](#profiletsx)

---

## App.tsx

### Descripción
Componente raíz de la aplicación que controla el flujo de autenticación.

### Props
Ninguna (es el componente raíz)

### Estado
```typescript
const [isAuthenticated, setIsAuthenticated] = useState(false);
```

### Hooks Utilizados
- `useState`: Manejo del estado de autenticación
- `useEffect`: Verificación de token al montar el componente

### Flujo
```
1. Componente se monta
2. useEffect verifica si existe auth_token en localStorage
3. Si existe token → setIsAuthenticated(true) → Muestra Dashboard
4. Si no existe → setIsAuthenticated(false) → Muestra Login
```

### Código Explicado

```typescript
export default function App() {
  // Estado que controla si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Al montar, verifica si hay sesión guardada
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true); // Auto-login
    }
  }, []); // [] = Solo se ejecuta una vez al montar

  // Renderizado condicional
  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={() => setIsAuthenticated(true)} />
        <Toaster /> {/* Componente para mostrar notificaciones */}
      </>
    );
  }

  return (
    <>
      <Dashboard onLogout={() => setIsAuthenticated(false)} />
      <Toaster />
    </>
  );
}
```

### Callbacks
- `onLogin`: Se ejecuta cuando login es exitoso
- `onLogout`: Se ejecuta cuando usuario cierra sesión

---

## Login.tsx

### Descripción
Pantalla de inicio de sesión con validación y manejo de errores.

### Props
```typescript
interface LoginProps {
  onLogin: () => void; // Callback ejecutado al login exitoso
}
```

### Estado
```typescript
const [email, setEmail] = useState('');       // Email ingresado
const [password, setPassword] = useState(''); // Password ingresado
const [isLoading, setIsLoading] = useState(false); // Loading state
const [error, setError] = useState('');       // Mensaje de error
```

### Funciones

#### handleSubmit
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // Previene recarga de página
  setError(''); // Limpia errores previos
  setIsLoading(true); // Muestra estado de carga

  try {
    // Llama a la API de login
    const response = await login({ email, password });
    
    // Guarda token y datos en localStorage
    saveAuthData(response);
    
    // Notifica al componente padre (App.tsx)
    onLogin();
  } catch (err) {
    // Muestra error al usuario
    setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
  } finally {
    setIsLoading(false); // Oculta estado de carga
  }
};
```

### UI/UX
- **Inputs deshabilitados durante carga**: Previene múltiples envíos
- **Mensaje de error visible**: Alert rojo con el error
- **Botón con feedback**: Muestra "Iniciando sesión..." durante carga
- **Diseño centrado**: Card centrada en pantalla con gradiente de fondo

---

## Dashboard.tsx

### Descripción
Layout principal con navegación lateral y área de contenido.

### Props
```typescript
interface DashboardProps {
  onLogout: () => void; // Callback para cerrar sesión
}
```

### Estado
```typescript
type Tab = 'buses' | 'routes' | 'drivers' | 'admins' | 'profile';
const [activeTab, setActiveTab] = useState<Tab>('buses');
```

### Estructura del Layout

```
┌────────────────────────────────────────────┐
│ Header: Logo + Título + Botón Logout      │
├──────────────┬─────────────────────────────┤
│   Sidebar    │    Main Content Area        │
│              │                             │
│ • Buses      │  {activeTab === 'buses' &&  │
│ • Rutas      │    <BusManagement />}       │
│ • Choferes   │                             │
│ • Admins     │  {activeTab === 'routes' && │
│ • Mi Perfil  │    <RouteManagement />}     │
│              │                             │
│              │  ... etc                    │
└──────────────┴─────────────────────────────┘
```

### Navegación

```typescript
// Cada botón del sidebar actualiza activeTab
<Button
  variant={activeTab === 'buses' ? 'default' : 'ghost'}
  onClick={() => setActiveTab('buses')}
>
  <Bus className="w-4 h-4 mr-2" />
  Buses
</Button>
```

- **variant='default'**: Botón activo (azul)
- **variant='ghost'**: Botón inactivo (transparente)

### Renderizado Condicional

```typescript
<main>
  {activeTab === 'buses' && <BusManagement />}
  {activeTab === 'routes' && <RouteManagement />}
  {activeTab === 'drivers' && <DriverManagement />}
  {activeTab === 'admins' && <AdminManagement />}
  {activeTab === 'profile' && <Profile />}
</main>
```

Solo se renderiza el componente de la tab activa.

---

## BusManagement.tsx

### Descripción
CRUD completo para gestión de buses. Carga datos desde API y permite crear, editar y listar buses.

### Estado
```typescript
const [buses, setBuses] = useState<Bus[]>([]);           // Lista de buses
const [editingBus, setEditingBus] = useState<Bus | null>(null); // Bus en edición
const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado del diálogo
const [isLoading, setIsLoading] = useState(true);        // Carga inicial
const [isSaving, setIsSaving] = useState(false);         // Guardando datos
```

### Ciclo de Vida

```typescript
useEffect(() => {
  loadBuses(); // Carga datos al montar
}, []); // Array vacío = solo se ejecuta una vez
```

### Funciones Principales

#### loadBuses()
```typescript
const loadBuses = async () => {
  setIsLoading(true);
  try {
    const data = await getBuses(); // GET /buses
    setBuses(data); // Actualiza estado
  } catch (error) {
    toast.error('Error al cargar buses: ' + error.message);
  } finally {
    setIsLoading(false); // Siempre se ejecuta
  }
};
```

#### handleSubmit()
```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSaving(true);

  // Extrae datos del formulario
  const formData = new FormData(e.currentTarget);
  const busData = {
    plate: formData.get('plate') as string,
    model: formData.get('model') as string,
    capacity: parseInt(formData.get('capacity') as string),
    status: formData.get('status') as 'active' | 'maintenance' | 'inactive',
    year: parseInt(formData.get('year') as string),
  };

  try {
    if (editingBus) {
      // ACTUALIZAR: PUT /buses/:id
      const updated = await updateBus(editingBus.id, busData);
      // Actualiza el bus en el array local
      setBuses(buses.map(bus => bus.id === editingBus.id ? updated : bus));
      toast.success('Bus actualizado');
    } else {
      // CREAR: POST /buses
      const created = await createBus(busData);
      // Agrega el nuevo bus al array
      setBuses([...buses, created]);
      toast.success('Bus creado');
    }
    
    // Cierra diálogo y limpia estado
    setIsDialogOpen(false);
    setEditingBus(null);
  } catch (error) {
    toast.error('Error: ' + error.message);
  } finally {
    setIsSaving(false);
  }
};
```

### Renderizado de Estados

```typescript
{isLoading ? (
  // Estado de carga inicial
  <div className="flex items-center justify-center py-8">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
  </div>
) : buses.length === 0 ? (
  // Sin datos
  <div className="text-center py-8 text-gray-500">
    No hay buses registrados
  </div>
) : (
  // Tabla con datos
  <Table>
    {/* ... */}
  </Table>
)}
```

### Diálogo de Formulario

```typescript
<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogTrigger asChild>
    <Button onClick={() => setEditingBus(null)}>
      <Plus className="w-4 h-4 mr-2" />
      Agregar Bus
    </Button>
  </DialogTrigger>
  <DialogContent>
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
      <Input
        name="plate"
        defaultValue={editingBus?.plate} // Pre-llena si está editando
        disabled={isSaving}
        required
      />
      {/* ... más campos ... */}
      
      <Button type="submit" disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader2 className="animate-spin" />
            Guardando...
          </>
        ) : (
          editingBus ? 'Guardar Cambios' : 'Agregar Bus'
        )}
      </Button>
    </form>
  </DialogContent>
</Dialog>
```

### Badges de Estado

```typescript
const getStatusBadge = (status: Bus['status']) => {
  const variants = {
    active: { variant: 'default', label: 'Activo' },
    maintenance: { variant: 'secondary', label: 'Mantenimiento' },
    inactive: { variant: 'destructive', label: 'Inactivo' },
  };
  const { variant, label } = variants[status];
  return <Badge variant={variant}>{label}</Badge>;
};
```

---

## RouteManagement.tsx

### Descripción
Gestión de rutas con funcionalidad de activar/desactivar.

### Similar a BusManagement con estas diferencias:

#### Función adicional: toggleRouteStatus()

```typescript
const toggleRouteStatus = async (id: string) => {
  const route = routes.find(r => r.id === id);
  if (!route) return;

  try {
    const newStatus = route.status === 'active' ? 'inactive' : 'active';
    
    // PUT /routes/:id con nuevo status
    const updated = await updateRoute(id, { status: newStatus });
    
    // Actualiza en estado local
    setRoutes(routes.map(r => r.id === id ? updated : r));
    
    toast.success(`Ruta ${newStatus === 'active' ? 'activada' : 'desactivada'}`);
  } catch (error) {
    toast.error('Error al cambiar estado');
  }
};
```

#### Botón de activar/desactivar

```typescript
<Button
  variant="ghost"
  size="sm"
  onClick={() => toggleRouteStatus(route.id)}
>
  {route.status === 'active' ? 'Desactivar' : 'Activar'}
</Button>
```

---

## DriverManagement.tsx

### Descripción
Gestión de choferes con información de contacto y experiencia.

### Campos específicos del formulario

```typescript
<Input
  name="license"
  placeholder="DL-12345"
  // Número de licencia de conducir
/>

<Input
  type="tel"
  name="phone"
  placeholder="+1234567890"
  // Teléfono de contacto
/>

<Input
  type="number"
  name="experience"
  placeholder="5"
  // Años de experiencia conduciendo
/>
```

### Estados posibles

```typescript
type DriverStatus = 'active' | 'on-leave' | 'inactive';

// active: Chofer activo trabajando
// on-leave: De permiso o vacaciones
// inactive: Inactivo (suspendido, retirado, etc.)
```

---

## AdminManagement.tsx

### Descripción
Registro y gestión de administradores del sistema.

### Particularidades

#### Campo contraseña condicional

```typescript
{!editingAdmin && (
  // Solo muestra contraseña al CREAR, no al EDITAR
  <div className="space-y-2">
    <Label htmlFor="password">Contraseña</Label>
    <Input
      id="password"
      name="password"
      type="password"
      placeholder="••••••••"
      required
    />
  </div>
)}
```

**Razón**: Al editar, no queremos cambiar la contraseña. El usuario debe usar la función de "Cambiar Contraseña" del perfil.

#### Roles disponibles

```typescript
<Select name="role" defaultValue={editingAdmin?.role || 'editor'}>
  <SelectContent>
    <SelectItem value="super-admin">Super Admin</SelectItem>
    <SelectItem value="admin">Administrador</SelectItem>
    <SelectItem value="editor">Editor</SelectItem>
  </SelectContent>
</Select>
```

**Permisos** (implementados en backend):
- **super-admin**: Acceso total
- **admin**: Gestión de datos sin crear otros admins
- **editor**: Solo visualización y edición de datos

#### Función toggleAdminStatus()

```typescript
const toggleAdminStatus = async (id: string) => {
  const admin = admins.find(a => a.id === id);
  if (!admin) return;

  const newStatus = admin.status === 'active' ? 'inactive' : 'active';
  
  try {
    const updated = await updateAdmin(id, { status: newStatus });
    setAdmins(admins.map(a => a.id === id ? updated : a));
    toast.success(`Administrador ${newStatus === 'active' ? 'activado' : 'desactivado'}`);
  } catch (error) {
    toast.error('Error al cambiar estado');
  }
};
```

Permite desactivar administradores sin eliminar su cuenta.

---

## Profile.tsx

### Descripción
Visualización y edición del perfil del usuario autenticado.

### Estado
```typescript
const [isEditing, setIsEditing] = useState(false);     // Modo edición
const [isLoading, setIsLoading] = useState(true);      // Carga inicial
const [isSaving, setIsSaving] = useState(false);       // Guardando
const [profile, setProfile] = useState({
  id: '',
  name: '',
  email: '',
  role: '',
  phone: '',
  createdAt: '',
  lastLogin: '',
});
```

### Carga de Datos

```typescript
useEffect(() => {
  loadProfile();
}, []);

const loadProfile = async () => {
  setIsLoading(true);
  try {
    const data = await getProfile(); // GET /profile
    setProfile(data);
  } catch (error) {
    toast.error('Error al cargar perfil');
  } finally {
    setIsLoading(false);
  }
};
```

### Sección 1: Información Personal

#### Vista (no editable)
```typescript
{!isEditing ? (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <p className="text-gray-500 text-sm">Nombre Completo</p>
      <p className="text-gray-900">{profile.name}</p>
    </div>
    <div>
      <p className="text-gray-500 text-sm">Correo Electrónico</p>
      <p className="text-gray-900">{profile.email}</p>
    </div>
    {/* ... más campos ... */}
  </div>
) : (
  // Formulario de edición
)}
```

#### Formulario de edición
```typescript
<form onSubmit={handleSubmit}>
  <Input
    name="name"
    defaultValue={profile.name}
    disabled={isSaving}
    required
  />
  <Input
    name="email"
    defaultValue={profile.email}
    disabled // Email NO es editable
  />
  <Input
    name="phone"
    defaultValue={profile.phone}
    disabled={isSaving}
    required
  />
  
  <Button type="submit" disabled={isSaving}>
    Guardar Cambios
  </Button>
  <Button 
    type="button" 
    variant="outline" 
    onClick={() => setIsEditing(false)}
  >
    Cancelar
  </Button>
</form>
```

### Sección 2: Cambiar Contraseña

```typescript
const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSaving(true);

  const formData = new FormData(e.currentTarget);
  const currentPassword = formData.get('current-password') as string;
  const newPassword = formData.get('new-password') as string;
  const confirmPassword = formData.get('confirm-password') as string;

  // Validación: Las contraseñas nuevas deben coincidir
  if (newPassword !== confirmPassword) {
    toast.error('Las contraseñas no coinciden');
    setIsSaving(false);
    return;
  }

  try {
    // PUT /profile/password
    await changePassword({ currentPassword, newPassword });
    toast.success('Contraseña actualizada correctamente');
    
    // Limpia el formulario
    (e.target as HTMLFormElement).reset();
  } catch (error) {
    toast.error('Error al cambiar contraseña');
  } finally {
    setIsSaving(false);
  }
};
```

### Avatar con Iniciales

```typescript
<Avatar className="w-20 h-20">
  <AvatarFallback className="text-2xl">
    {profile.name.split(' ').map(n => n[0]).join('')}
  </AvatarFallback>
</Avatar>
```

Ejemplo:
- **"Juan Pérez"** → **JP**
- **"María González"** → **MG**

---

## Patrones Comunes en Todos los Componentes

### 1. Carga Inicial de Datos

```typescript
useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  setIsLoading(true);
  try {
    const data = await getDataFromAPI();
    setData(data);
  } catch (error) {
    toast.error('Error al cargar');
  } finally {
    setIsLoading(false);
  }
};
```

### 2. Formulario de Crear/Editar

```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSaving(true);

  const formData = new FormData(e.currentTarget);
  const itemData = { /* extraer campos */ };

  try {
    if (editing) {
      const updated = await updateItem(editing.id, itemData);
      setItems(items.map(item => item.id === editing.id ? updated : item));
    } else {
      const created = await createItem(itemData);
      setItems([...items, created]);
    }
    closeDialog();
    toast.success('Guardado correctamente');
  } catch (error) {
    toast.error('Error al guardar');
  } finally {
    setIsSaving(false);
  }
};
```

### 3. Renderizado Condicional

```typescript
{isLoading ? (
  <Loader />
) : data.length === 0 ? (
  <EmptyState />
) : (
  <DataTable />
)}
```

### 4. Botones con Loading

```typescript
<Button disabled={isSaving}>
  {isSaving ? (
    <>
      <Loader2 className="animate-spin" />
      Guardando...
    </>
  ) : (
    'Guardar'
  )}
</Button>
```

### 5. Extracción de Datos del Formulario

```typescript
const formData = new FormData(e.currentTarget);
const data = {
  field1: formData.get('field1') as string,
  field2: parseInt(formData.get('field2') as string),
  field3: parseFloat(formData.get('field3') as string),
};
```

---

## Resumen de Dependencias entre Componentes

```
App.tsx
  ├─ Login.tsx
  │    └─ services/api.ts (login, saveAuthData)
  │
  └─ Dashboard.tsx
       ├─ BusManagement.tsx
       │    └─ services/api.ts (getBuses, createBus, updateBus)
       │
       ├─ RouteManagement.tsx
       │    └─ services/api.ts (getRoutes, createRoute, updateRoute)
       │
       ├─ DriverManagement.tsx
       │    └─ services/api.ts (getDrivers, createDriver, updateDriver)
       │
       ├─ AdminManagement.tsx
       │    └─ services/api.ts (getAdmins, createAdmin, updateAdmin)
       │
       └─ Profile.tsx
            └─ services/api.ts (getProfile, updateProfile, changePassword)
```

Todos los componentes importan elementos de `components/ui/*` (shadcn) para la interfaz.
