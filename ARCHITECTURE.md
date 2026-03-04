# Arquitectura del Proyecto

## Información General

- **Nombre**: Zeia Monitoring Portal
- **Propósito**: Portal de monitoreo para gestión energética, seguridad ocupacional y monitoreo ambiental
- **Stack**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS + shadcn/ui

---

## Estructura de Carpetas

```
app/
├── [modulo]/           # Módulos principales (energia, ocupacional, ambiental)
│   ├── page.tsx       # Página de login
│   └── dashboard/     # Dashboard del módulo
├── ui/                # Componentes reutilizables por módulo
│   ├── energia/
│   ├── ocupacional/
│   ├── filters/
│   └── sidebar/
├── services/          # Consumo de APIs
│   ├── energy/
│   ├── ambiental/
│   ├── filters/
│   ├── readings/
│   └── alerts/
├── lib/              # Utilidades core
│   ├── api.ts        # Funciones fetch autenticadas
│   ├── auth.ts       # Manejo de tokens
│   ├── constant.ts   # URLs base de APIs
│   └── stores/       # Zustand stores
└── utils/            # Helpers
    ├── formatter.ts   # Formatadores de fecha, números
    └── threshold.ts   # Umbrales

components/
└── ui/               # Componentes shadcn/ui
```

---

## Módulos del Sistema

### 1. Energía (`/energia`)

Gestión y monitoreo de consumo eléctrico.

**Rutas del Dashboard:**
| Ruta | Descripción |
|------|-------------|
| `/energia/dashboard/home` | Vista principal |
| `/energia/dashboard/panel` | Detalle de paneles eléctricos |
| `/energia/dashboard/tarifario` | Costos y facturación |
| `/energia/dashboard/monitoreo` | Monitoreo de potencia |
| `/energia/dashboard/desbalance` | Desbalance de corriente/voltaje |
| `/energia/dashboard/distorsion` | Distorsión armónica |

**Servicios relacionados:** `services/energy/`, `services/panel/`

---

### 2. Ocupacional (`/ocupacional`)

Seguridad y salud ocupacional.

**Rutas del Dashboard:**
| Ruta | Descripción |
|------|-------------|
| `/ocupacional/dashboard/rooms` | Listado de ambientes |
| `/ocupacional/dashboard/monitoreo` | Monitoreo en tiempo real |
| `/ocupacional/dashboard/analisis` | Análisis de datos |
| `/ocupacional/dashboard/alertas` | Gestión de alertas |
| `/ocupacional/dashboard/covid` | Métricas COVID |

**Sub-rutas de Análisis:**
- `/ocupacional/dashboard/analisis/indicadores`
- `/ocupacional/dashboard/analisis/estadisticas`
- `/ocupacional/dashboard/analisis/picoshistoricos`

**Servicios relacionados:** `services/readings/`, `services/alerts/`, `services/enterprise/`

---

### 3. Ambiental (`/ambiental`)

Monitoreo ambiental.

**Rutas del Dashboard:**
| Ruta | Descripción |
|------|-------------|
| `/ambiental/dashboard/monitoreo` | Monitoreo en tiempo real |
| `/ambiental/dashboard/analisis` | Análisis de datos |
| `/ambiental/dashboard/alertas` | Gestión de alertas |

> **Nota:** Actualmente en mantenimiento, no es prioridad.

---

## Arquitectura de Datos

### APIs

| API | Base URL | Propósito |
|-----|----------|-----------|
| **Energy** | `https://api.energy.zeia.com.pe` | Gestión energética |
| **Ocupacional** | `https://api.zeia.com.pe` | Seguridad ocupacional |
| **Ambiental** | `https://apiambiental.zeia.com.pe` | Monitoreo ambiental |

### Servicios

Los servicios están agrupados por dominio funcional:

- **energy/**: Tarifario, distorsión, desbalance, monitoreo
- **panel/**: Mediciones de paneles eléctricos
- **readings/**: Lecturas de sensores (ambiental, ocupacional)
- **alerts/**: Gestión de alertas
- **enterprise/**: Sedes, ambientes, puntos de medición
- **filters/**: Datos para filtros (sedes, paneles, puntos)

---

## Autenticación

Cada módulo tiene su propio flujo de login:
- `/energia` → Login energía
- `/ocupacional` → Login ocupacional  
- `/ambiental` → Login ambiental

El sidebar dinámicamente carga los módulos disponibles según el token del usuario.

---

## Componentes Compartidos

### Filtros
- Headquarters (sedes)
- Panels (paneles eléctricos)
- Rooms/Ambients (ambientes)
- Measurement Points (puntos de medición)
- Date Range (rango de fechas)

### UI
- Sidebar dinámico
- Paginación
- Skeleton loaders
- Tablas y gráficos (Recharts, Chart.js)
