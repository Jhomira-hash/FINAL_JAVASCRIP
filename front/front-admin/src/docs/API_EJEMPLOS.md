# Ejemplos de Uso de la API - Panel etransa

## Índice
1. [Autenticación](#autenticación)
2. [Buses](#buses)
3. [Rutas](#rutas)
4. [Choferes](#choferes)
5. [Administradores](#administradores)
6. [Perfil](#perfil)

---

## Autenticación

### Login

**Request**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@etransa.com",
  "password": "mypassword123"
}
```

**Response (200 OK)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_123",
    "name": "Juan Pérez",
    "email": "admin@etransa.com",
    "role": "super-admin"
  }
}
```

**Uso en el código**
```typescript
import { login, saveAuthData } from '../services/api';

const response = await login({
  email: 'admin@etransa.com',
  password: 'mypassword123'
});

// Guarda token y datos en localStorage
saveAuthData(response);

// Ahora todas las peticiones incluyen el token automáticamente
```

---

## Buses

### Obtener todos los buses

**Request**
```http
GET /buses
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```json
[
  {
    "id": "bus_1",
    "plate": "ABC-123",
    "model": "Mercedes-Benz O500",
    "capacity": 45,
    "status": "active",
    "year": 2022
  },
  {
    "id": "bus_2",
    "plate": "XYZ-456",
    "model": "Volvo 9700",
    "capacity": 50,
    "status": "maintenance",
    "year": 2023
  }
]
```

**Uso en el código**
```typescript
import { getBuses } from '../services/api';

const buses = await getBuses();
console.log(buses); // Array de buses
```

---

### Crear un bus

**Request**
```http
POST /buses
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "plate": "DEF-789",
  "model": "Scania K360",
  "capacity": 42,
  "status": "active",
  "year": 2024
}
```

**Response (201 Created)**
```json
{
  "id": "bus_3",
  "plate": "DEF-789",
  "model": "Scania K360",
  "capacity": 42,
  "status": "active",
  "year": 2024
}
```

**Uso en el código**
```typescript
import { createBus } from '../services/api';

const newBus = await createBus({
  plate: "DEF-789",
  model: "Scania K360",
  capacity: 42,
  status: "active",
  year: 2024
});

console.log(newBus.id); // "bus_3"
```

---

### Actualizar un bus

**Request**
```http
PUT /buses/bus_1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "status": "maintenance",
  "capacity": 46
}
```

**Response (200 OK)**
```json
{
  "id": "bus_1",
  "plate": "ABC-123",
  "model": "Mercedes-Benz O500",
  "capacity": 46,
  "status": "maintenance",
  "year": 2022
}
```

**Uso en el código**
```typescript
import { updateBus } from '../services/api';

const updatedBus = await updateBus('bus_1', {
  status: 'maintenance',
  capacity: 46
});
```

---

### Eliminar un bus

**Request**
```http
DELETE /buses/bus_1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (204 No Content)**
```
(vacío)
```

**Uso en el código**
```typescript
import { deleteBus } from '../services/api';

await deleteBus('bus_1');
// No retorna nada
```

---

## Rutas

### Obtener todas las rutas

**Request**
```http
GET /routes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```json
[
  {
    "id": "route_1",
    "name": "Ruta Norte",
    "origin": "Ciudad A",
    "destination": "Ciudad B",
    "distance": 250,
    "duration": 180,
    "price": 25.00,
    "status": "active"
  },
  {
    "id": "route_2",
    "name": "Ruta Sur",
    "origin": "Ciudad A",
    "destination": "Ciudad C",
    "distance": 350,
    "duration": 240,
    "price": 35.00,
    "status": "active"
  }
]
```

---

### Crear una ruta

**Request**
```http
POST /routes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Ruta Este",
  "origin": "Ciudad B",
  "destination": "Ciudad D",
  "distance": 180,
  "duration": 120,
  "price": 20.00,
  "status": "active"
}
```

**Response (201 Created)**
```json
{
  "id": "route_3",
  "name": "Ruta Este",
  "origin": "Ciudad B",
  "destination": "Ciudad D",
  "distance": 180,
  "duration": 120,
  "price": 20.00,
  "status": "active"
}
```

---

### Actualizar una ruta

**Request**
```http
PUT /routes/route_1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "price": 28.00,
  "status": "inactive"
}
```

**Response (200 OK)**
```json
{
  "id": "route_1",
  "name": "Ruta Norte",
  "origin": "Ciudad A",
  "destination": "Ciudad B",
  "distance": 250,
  "duration": 180,
  "price": 28.00,
  "status": "inactive"
}
```

---

## Choferes

### Obtener todos los choferes

**Request**
```http
GET /drivers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```json
[
  {
    "id": "drv_1",
    "name": "Carlos Méndez",
    "license": "DL-12345",
    "phone": "+1234567890",
    "email": "carlos@etransa.com",
    "status": "active",
    "experience": 8
  },
  {
    "id": "drv_2",
    "name": "Ana Torres",
    "license": "DL-67890",
    "phone": "+0987654321",
    "email": "ana@etransa.com",
    "status": "active",
    "experience": 5
  }
]
```

---

### Crear un chofer

**Request**
```http
POST /drivers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Luis Ramírez",
  "license": "DL-11223",
  "phone": "+1122334455",
  "email": "luis@etransa.com",
  "status": "active",
  "experience": 12
}
```

**Response (201 Created)**
```json
{
  "id": "drv_3",
  "name": "Luis Ramírez",
  "license": "DL-11223",
  "phone": "+1122334455",
  "email": "luis@etransa.com",
  "status": "active",
  "experience": 12
}
```

---

### Actualizar un chofer

**Request**
```http
PUT /drivers/drv_1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "status": "on-leave",
  "phone": "+1234567899"
}
```

**Response (200 OK)**
```json
{
  "id": "drv_1",
  "name": "Carlos Méndez",
  "license": "DL-12345",
  "phone": "+1234567899",
  "email": "carlos@etransa.com",
  "status": "on-leave",
  "experience": 8
}
```

---

## Administradores

### Obtener todos los administradores

**Request**
```http
GET /admins
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```json
[
  {
    "id": "adm_1",
    "name": "Juan Pérez",
    "email": "juan@etransa.com",
    "role": "super-admin",
    "status": "active",
    "createdAt": "2024-01-15"
  },
  {
    "id": "adm_2",
    "name": "María González",
    "email": "maria@etransa.com",
    "role": "admin",
    "status": "active",
    "createdAt": "2024-03-20"
  }
]
```

---

### Crear un administrador

**Request**
```http
POST /admins
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Pedro Silva",
  "email": "pedro@etransa.com",
  "password": "securePassword123",
  "role": "editor",
  "status": "active"
}
```

**Response (201 Created)**
```json
{
  "id": "adm_3",
  "name": "Pedro Silva",
  "email": "pedro@etransa.com",
  "role": "editor",
  "status": "active",
  "createdAt": "2024-10-28"
}
```

**⚠️ Nota**: La contraseña NO se retorna en la respuesta por seguridad.

---

### Actualizar un administrador

**Request**
```http
PUT /admins/adm_2
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "role": "super-admin",
  "status": "active"
}
```

**Response (200 OK)**
```json
{
  "id": "adm_2",
  "name": "María González",
  "email": "maria@etransa.com",
  "role": "super-admin",
  "status": "active",
  "createdAt": "2024-03-20"
}
```

---

## Perfil

### Obtener perfil del usuario actual

**Request**
```http
GET /profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**
```json
{
  "id": "usr_123",
  "name": "Juan Pérez",
  "email": "juan@etransa.com",
  "role": "Super Admin",
  "phone": "+1234567890",
  "createdAt": "15 de enero, 2024",
  "lastLogin": "28 de octubre, 2025"
}
```

**Uso en el código**
```typescript
import { getProfile } from '../services/api';

const profile = await getProfile();
console.log(profile.name); // "Juan Pérez"
```

---

### Actualizar perfil

**Request**
```http
PUT /profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Juan Carlos Pérez",
  "phone": "+0987654321"
}
```

**Response (200 OK)**
```json
{
  "id": "usr_123",
  "name": "Juan Carlos Pérez",
  "email": "juan@etransa.com",
  "role": "Super Admin",
  "phone": "+0987654321",
  "createdAt": "15 de enero, 2024",
  "lastLogin": "28 de octubre, 2025"
}
```

**⚠️ Nota**: El email NO se puede cambiar desde este endpoint.

---

### Cambiar contraseña

**Request**
```http
PUT /profile/password
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Response (200 OK)**
```json
{
  "message": "Contraseña actualizada correctamente"
}
```

**Uso en el código**
```typescript
import { changePassword } from '../services/api';

await changePassword({
  currentPassword: 'oldPassword123',
  newPassword: 'newSecurePassword456'
});
```

---

## Manejo de Errores

### Error 400 - Bad Request

**Response**
```json
{
  "message": "La placa ABC-123 ya está registrada"
}
```

**En el código**
```typescript
try {
  await createBus(busData);
} catch (error) {
  // error.message = "La placa ABC-123 ya está registrada"
  toast.error(error.message);
}
```

---

### Error 401 - Unauthorized

**Response**
```json
{
  "message": "Token inválido o expirado"
}
```

**Solución**: Hacer logout y login nuevamente

---

### Error 403 - Forbidden

**Response**
```json
{
  "message": "No tienes permisos para realizar esta acción"
}
```

**Causa**: El rol del usuario no tiene acceso a esa operación

---

### Error 404 - Not Found

**Response**
```json
{
  "message": "Bus no encontrado"
}
```

---

### Error 500 - Internal Server Error

**Response**
```json
{
  "message": "Error interno del servidor"
}
```

**Acción**: Contactar al administrador del backend

---

## Tips de Desarrollo

### 1. Testing con Mock Data

Si el backend aún no está listo, puedes mockear las respuestas:

```typescript
// services/api.ts (temporal)
export async function getBuses(): Promise<Bus[]> {
  // Simula delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retorna datos de prueba
  return [
    { id: '1', plate: 'ABC-123', model: 'Mercedes', capacity: 45, status: 'active', year: 2023 },
    { id: '2', plate: 'XYZ-456', model: 'Volvo', capacity: 50, status: 'active', year: 2024 },
  ];
}
```

### 2. Debugging en DevTools

1. Abre DevTools (F12)
2. Ve a Network
3. Filtra por Fetch/XHR
4. Inspecciona Request/Response

### 3. Usar Postman/Insomnia

Prueba los endpoints antes de integrarlos:
1. Importa la colección
2. Configura variables de entorno
3. Ejecuta peticiones manualmente

---

## Resumen de Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Iniciar sesión |
| GET | `/buses` | Listar buses |
| POST | `/buses` | Crear bus |
| PUT | `/buses/:id` | Actualizar bus |
| DELETE | `/buses/:id` | Eliminar bus |
| GET | `/routes` | Listar rutas |
| POST | `/routes` | Crear ruta |
| PUT | `/routes/:id` | Actualizar ruta |
| DELETE | `/routes/:id` | Eliminar ruta |
| GET | `/drivers` | Listar choferes |
| POST | `/drivers` | Crear chofer |
| PUT | `/drivers/:id` | Actualizar chofer |
| DELETE | `/drivers/:id` | Eliminar chofer |
| GET | `/admins` | Listar administradores |
| POST | `/admins` | Crear administrador |
| PUT | `/admins/:id` | Actualizar administrador |
| DELETE | `/admins/:id` | Eliminar administrador |
| GET | `/profile` | Obtener perfil |
| PUT | `/profile` | Actualizar perfil |
| PUT | `/profile/password` | Cambiar contraseña |
