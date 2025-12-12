# Configuración de la API REST para etransa

Este documento explica cómo configurar la conexión con tu API REST backend.

## Configuración

1. Abre el archivo `/services/api.ts`
2. Modifica la constante `API_BASE_URL` con la URL de tu API backend:

```typescript
const API_BASE_URL = 'https://tu-api.com/v1';
```

## Endpoints Requeridos

Tu API backend debe implementar los siguientes endpoints:

### Autenticación

- `POST /auth/login` - Iniciar sesión
  - Body: `{ email: string, password: string }`
  - Response: `{ token: string, user: { id, name, email, role } }`

### Buses

- `GET /buses` - Obtener todos los buses
- `POST /buses` - Crear un nuevo bus
- `PUT /buses/:id` - Actualizar un bus
- `DELETE /buses/:id` - Eliminar un bus

### Rutas

- `GET /routes` - Obtener todas las rutas
- `POST /routes` - Crear una nueva ruta
- `PUT /routes/:id` - Actualizar una ruta
- `DELETE /routes/:id` - Eliminar una ruta

### Choferes

- `GET /drivers` - Obtener todos los choferes
- `POST /drivers` - Crear un nuevo chofer
- `PUT /drivers/:id` - Actualizar un chofer
- `DELETE /drivers/:id` - Eliminar un chofer

### Administradores

- `GET /admins` - Obtener todos los administradores
- `POST /admins` - Crear un nuevo administrador
- `PUT /admins/:id` - Actualizar un administrador
- `DELETE /admins/:id` - Eliminar un administrador

### Perfil

- `GET /profile` - Obtener perfil del usuario actual
- `PUT /profile` - Actualizar perfil del usuario
- `PUT /profile/password` - Cambiar contraseña

## Autenticación

La aplicación usa autenticación basada en tokens JWT. El token se almacena en `localStorage` y se incluye automáticamente en todas las peticiones mediante el header `Authorization: Bearer {token}`.

## Manejo de Errores

La API debe retornar respuestas con los siguientes códigos de estado:

- `200` - Éxito
- `201` - Recurso creado
- `400` - Error de validación
- `401` - No autenticado
- `403` - Sin permisos
- `404` - Recurso no encontrado
- `500` - Error del servidor

Los errores deben retornar un JSON con el formato:
```json
{
  "message": "Descripción del error"
}
```

## Desarrollo Local

Para desarrollo local sin un backend real, puedes usar herramientas como:

- JSON Server
- MockAPI
- Postman Mock Server

O modificar temporalmente el archivo `api.ts` para usar datos mockeados localmente.
