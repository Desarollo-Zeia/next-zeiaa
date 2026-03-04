# Rooms - Listado de Salas

## Descripción general

Página que muestra el listado de todas las salas de la empresa con tarjetas de estado. Permite filtrar por sede y buscar por nombre. Incluye paginación.

## Ruta

```
/ocupacional/dashboard/rooms
```

## Archivos del componente

```
app/ocupacional/dashboard/rooms/
├── page.tsx      # Componente principal
├── loading.tsx   # Estado de carga (skeleton)
└── error.tsx     # Manejo de errores
```

---

## Página Principal (`page.tsx`)

### Imports

```tsx
import RoomStatusCard from '@/app/ui/rooms/room-status-card'
import styles from '@/app/ui/home.module.css'
import RoomSearchFilter from '@/app/ui/filters/search'
import FiltersContainer from '@/app/ui/filters/filters-container'
import NoResultFound from '@/app/ui/no-result-found'
import PaginationComponent from '@/app/ui/pagination'
import { roomsList } from '@/app/services/enterprise/data'
import HeadquarterSelect from '@/app/ui/filters/headquarter-select'
import { getHeadquartersOcupacional } from '@/app/services/filters/data'
import { SearchParams } from '@/app/type'
import { getToken } from '@/app/lib/auth'
import { Suspense } from 'react'
import RoomSkeleton from './loading'
```

### Parámetros de URL (searchParams)

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `search` | string | Búsqueda por nombre de sala |
| `status` | string | Estado de la sala (comentado) |
| `headquarter` | string | ID de la sede |
| `page` | string | Número de página |
| `limit` | string | Límite de resultados |
| `offset` | string | Offset para paginación |

### Servicios utilizados

#### `roomsList`
Obtiene el listado de salas desde la API.

- **Endpoint:** `/enterprise/api/enterprise/room-list/`
- **Método:** GET con autenticación
- **Parámetros:**
  - `search` - Búsqueda por nombre
  - `status` - Estado de la sala
  - `headquarter` - ID de sede
  - `page` - Número de página
  - `limit` - Límite de resultados
  - `offset` - Offset
- **Cache:** `cacheLife('minutes')`

#### `getHeadquartersOcupacional`
Obtiene el listado de sedes disponibles.

### Tipo de dato `Room`

```typescript
interface Room {
  id: number
  name: string
  status: string
  is_activated: boolean,
  devices: { dev_eui: string, id: number, type_sensor: string }[],
  headquarter: { id: number, name: string }
}
```

### Filtros disponibles

1. **HeadquarterSelect** - Dropdown para filtrar por sede
2. **RoomSearchFilter** - Input de búsqueda por nombre

### Componentes de UI

1. **RoomStatusCard** - Tarjeta individual de sala
2. **FiltersContainer** - Contenedor de filtros
3. **NoResultFound** - Mensaje cuando no hay resultados
4. **PaginationComponent** - Paginación

---

## RoomStatusCard

Componente que renderiza cada tarjeta de sala.

### Props

```typescript
type Props = {
  name: string,           // Nombre de la sala
  status: string,          // Estado (comentado)
  isActivated: boolean,   // Si está activada
  room: number,           // ID de la sala
  devEUI: string,         // ID del dispositivo
  headquarter: string     // Nombre de la sede
}
```

### Elementos visuales

1. **Icono de estado:**
   - `PlugZap` (verde) si está activada
   - `Unplug` (rojo) si está desactivada

2. **Indicador de conexión:**
   - Círculo parpadeante verde/rojo
   - Texto "Conectado" / "Desconectado"

3. **Nombre de la sala** - Texto capitalizado, alineado a la derecha

4. **Sede** - Nombre de la sede en texto muted

### Acciones

1. **Botón "Ir a detalles de la sala"**
   - Navega a: `/${module}/dashboard/monitoreo?room={id}&devEUI={devEUI}`
   - Ejecuta `changeRoom(room)` para actualizar el estado global

2. **RoomToggleImage**
   - Componente para activar/desactivar la sala

---

## Loading State (`loading.tsx`)

Muestra un skeleton mientras cargan los datos.

### Estructura

- Contenedor de filtros con 2 skeleton
- Grid de 12 `RoomStatusCardSkeleton`
- Paginación skeleton

### Skeleton de tarjeta

Simula la estructura de `RoomStatusCard` con:
- Icono (64x64)
- Nombre y estado
- Campos de detalle
- Sede
- Botón

---

## Error Handling (`error.tsx`)

Utiliza el componente reutilizable `CustomErrorUI`.

```tsx
'use client'
import CustomErrorUI from "@/app/ui/error-found";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <CustomErrorUI error={error} reset={reset} />;
}
```

---

## Flujo de datos

```
1. user → page.tsx (with searchParams)
2. getToken() → authToken
3. roomsList({ search, status, headquarter, page, limit, offset, token })
4. getHeadquartersOcupacional({ token })
5. Render: FiltersContainer → HeadquarterSelect + RoomSearchFilter
6. Render: RoomStatusCard[] (mapeado de results)
7. Render: PaginationComponent (si count > 0)
```

---

## Notas

- El filtro por `status` está comentado en el código
- La paginación muestra 10 items por página
- El cache de las funciones está comentado pero disponible con `cacheLife`
- Usa `Suspense` para el loading state
