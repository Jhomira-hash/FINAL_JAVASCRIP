# Guía Rápida - Panel etransa

## Inicio Rápido

### 1. Configurar la API
```typescript
// Editar: /services/api.ts
const API_BASE_URL = 'https://tu-api-backend.com/v1';
```

### 2. Instalar y Ejecutar
```bash
npm install
npm run dev
```

### 3. Login
- Email: `admin@etransa.com`
- Password: (según tu backend)

---

## Estructura del Proyecto

```
/
├── App.tsx                    # Punto de entrada
├── services/
│   └── api.ts                # Conexión con API REST
├── components/
│   ├── Login.tsx             # Pantalla de login
│   ├── Dashboard.tsx         # Layout principal
│   ├── BusManagement.tsx     # CRUD de buses
│   ├── RouteManagement.tsx   # CRUD de rutas
│   ├── DriverManagement.tsx  # CRUD de choferes
│   ├── AdminManagement.tsx   # CRUD de admins
│   └── Profile.tsx           # Perfil de usuario
└── docs/                     # Documentación
```

---

## Funcionalidades por Sección

### 🚌 Buses
- ✅ Ver lista de buses
- ✅ Agregar nuevo bus (placa, modelo, capacidad, año)
- ✅ Editar información de buses
- ✅ Cambiar estado: Activo / Mantenimiento / Inactivo

### 🛣️ Rutas
- ✅ Ver lista de rutas
- ✅ Crear rutas (origen, destino, distancia, duración, precio)
- ✅ Editar rutas existentes
- ✅ Activar/Desactivar rutas

### 👨‍✈️ Choferes
- ✅ Listar choferes
- ✅ Registrar nuevos choferes (nombre, licencia, teléfono, email)
- ✅ Editar información de choferes
- ✅ Estados: Activo / De Permiso / Inactivo

### 👥 Administradores
- ✅ Ver administradores del sistema
- ✅ Registrar nuevos administradores
- ✅ Asignar roles: Super Admin / Admin / Editor
- ✅ Activar/Desactivar cuentas

### 👤 Mi Perfil
- ✅ Ver información personal
- ✅ Editar nombre y teléfono
- ✅ Cambiar contraseña

---

## Flujo de Trabajo Típico

### Agregar un Bus

1. Click en **"Buses"** en el sidebar
2. Click en **"Agregar Bus"**
3. Llenar formulario:
   - Placa: `ABC-123`
   - Modelo: `Mercedes-Benz O500`
   - Capacidad: `45`
   - Año: `2023`
   - Estado: `Activo`
4. Click en **"Agregar Bus"**
5. ✅ Notificación de éxito
6. Bus aparece en la tabla

### Editar una Ruta

1. Click en **"Rutas"** en el sidebar
2. Click en el icono ✏️ junto a la ruta
3. Modificar campos necesarios
4. Click en **"Guardar Cambios"**
5. ✅ Ruta actualizada

### Cambiar Contraseña

1. Click en **"Mi Perfil"** en el sidebar
2. Scroll a sección **"Cambiar Contraseña"**
3. Ingresar:
   - Contraseña actual
   - Nueva contraseña
   - Confirmar nueva contraseña
4. Click en **"Actualizar Contraseña"**
5. ✅ Contraseña cambiada

---

## Estados de la Aplicación

### 🔄 Cargando
- Muestra spinner mientras carga datos
- Aparece al entrar a cada sección

### ✅ Datos Cargados
- Tabla con toda la información
- Botones de acción disponibles

### ⚠️ Sin Datos
- Mensaje: "No hay [buses/rutas/choferes] registrados"
- Botón para agregar el primero

### ❌ Error
- Toast rojo con mensaje de error
- Usuario puede reintentar

### 💾 Guardando
- Botón muestra "Guardando..." con spinner
- Inputs deshabilitados
- Previene múltiples envíos

---

## Notificaciones

### Tipos de Toast

**✅ Éxito (Verde)**
```
"Bus creado correctamente"
"Ruta actualizada correctamente"
"Contraseña cambiada"
```

**❌ Error (Rojo)**
```
"Error al cargar buses: [mensaje]"
"Error al guardar: [mensaje]"
"Las contraseñas no coinciden"
```

---

## Atajos de Teclado

| Acción | Tecla |
|--------|-------|
| Cerrar diálogo | `ESC` |
| Enviar formulario | `ENTER` (en inputs) |
| Navegar entre campos | `TAB` |

---

## Troubleshooting

### "Error al cargar datos"
**Solución**: 
1. Verificar que el backend esté corriendo
2. Revisar URL en `/services/api.ts`
3. Abrir DevTools → Network → Ver error específico

### "401 Unauthorized"
**Solución**: 
1. Token expirado → Cerrar sesión y volver a entrar
2. Backend requiere autenticación → Verificar configuración

### Datos no se actualizan
**Solución**:
1. Refrescar la página
2. Verificar que el endpoint retorne el objeto actualizado
3. Revisar consola del navegador

### Toast no aparece
**Solución**:
1. Verificar que `<Toaster />` esté en `App.tsx`
2. Revisar importación: `import { toast } from 'sonner@2.0.3'`

---

## Tips y Mejores Prácticas

### Para Desarrolladores

1. **Siempre manejar errores**
```typescript
try {
  await apiCall();
} catch (error) {
  toast.error('Error: ' + error.message);
}
```

2. **Usar estados de carga**
```typescript
setIsLoading(true);
await loadData();
setIsLoading(false);
```

3. **Validar formularios**
```typescript
if (newPassword !== confirmPassword) {
  toast.error('Las contraseñas no coinciden');
  return;
}
```

### Para Usuarios

1. **Usa filtros y búsqueda** (próximamente)
2. **Revisa notificaciones** para confirmar acciones
3. **Mantén datos actualizados** editando regularmente

---

## Próximas Funcionalidades

- [ ] Búsqueda y filtrado de datos
- [ ] Paginación en tablas
- [ ] Exportar datos a Excel/PDF
- [ ] Gráficos de estadísticas
- [ ] Notificaciones en tiempo real
- [ ] Historial de cambios
- [ ] Roles y permisos avanzados

---

## Soporte

Para reportar errores o solicitar funcionalidades, contacta al equipo de desarrollo.

**Documentación adicional**:
- `DOCUMENTACION_TECNICA.md` - Explicación técnica completa
- `GUIA_DE_COMPONENTES.md` - Detalles de cada componente
- `README_API.md` - Endpoints de la API
