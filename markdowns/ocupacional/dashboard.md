# Dashboard Ocupacional - Estructura de Rutas

## Estructura general

```
/ocupacional/dashboard/
├── layout.tsx          # Layout con sidebar
├── rooms/              # Listado de salas
├── monitoreo/          # Monitoreo en tiempo real
├── alertas/           # Gestión de alertas
├── covid/             # Datos COVID
│   └── detail/        # Detalle de COVID
└── analisis/          # Módulo de análisis
    ├── indicadores/   # Tabla de indicadores
    ├── picoshistoricos/
    │   └── tabla/     # Tabla de picos históricos
    └── estadisticas/  # Gráficos y estadísticas
```

---

## `/rooms` - Listado de Salas

Muestra todas las salas de la empresa con tarjetas de estado. Permite filtrar por sede (`headquarter`) y buscar por nombre. Incluye paginación (10 items por página).

- **Filtros:** Sede, búsqueda por nombre
- **Servicios:** `roomsList`, `getHeadquartersOcupacional`

---

## `/monitoreo` - Monitoreo en Tiempo Real

Gráfico de lecturas en tiempo real de la última hora para múltiples salas. Muestra indicadores de CO2, Temperatura y Humedad. Optimizado con parallel requests para evitar waterfalls.

- **Filtros:** Indicador (CO2/TEMP/HUM), unidad
- **Rango de tiempo:** Última hora (fijo)
- **Servicios:** `readingsGraph`, `roomGeneralData`

---

## `/alertas` - Gestión de Alertas

Tabla con historial de alertas de las salas. Muestra lecturas que superaron umbrales (fuera de GOOD/MODERATE). Soporta filtrado por sala, indicador, rango de fechas y estado.

- **Filtros:** Sala, rango de fechas, estado
- **Servicios:** `alerts`, `roomGeneralData`

---

## `/covid` - Datos COVID

Tabla de lecturas relacionadas con COVID-19 (CO2 principalmente). Muestra valores y líneas base (baselines) para comparación. Permite ver detalle de cada día.

- **Filtros:** Sala, indicador (CO2), rango de fechas
- **Servicios:** `readingsCovid`, `readingsCovidBaselines`

---

## `/covid/detail` - Detalle COVID

Vista detallada de lecturas de un día específico. Muestra niveles de riesgo alcanzados y permite filtrar por rango horario y nivel de riesgo.

- **Filtros:** Fecha, sala, rango horario, nivel de riesgo
- **Servicios:** `readingsCovidDetail`, `readingsCovidBaselines`, `riskReached`

---

## `/analisis/indicadores` - Tabla de Indicadores

Tabla completa de lecturas con todos los detalles. Permite filtrar por estado (GOOD/MODERATE/BAD), rango de fechas, rango horaireo y ordenar por diferentes campos.

- **Filtros:** Sala, estado, rango de fechas, rango horaireo, ordenamiento
- **Servicios:** `readingsData`, `roomGeneralData`

---

## `/analisis/picoshistoricos` - Picos Históricos

Muestra el top 3 de valores más altos de cada sala. Permite alternar entre indicadores (CO2/TEMP/HUM). Incluye subruta `/tabla` para ver tabla detallada de picos.

- **Filtros:** Indicador, rango de fechas
- **Subruta:** `/analisis/picoshistoricos/tabla` - Tabla de picos altos/bajos
- **Servicios:** `readingsPeaks`, `roomGeneralData`

---

## `/analisis/estadisticas` - Estadísticas y Gráficos

Gráficos de evolución de lecturas en un período. Permite seleccionar indicador, rango de fechas, rango horaireo e intervalo de aggregation.

- **Filtros:** Sala, indicador, rango de fechas, rango horaireo, intervalo
- **Servicios:** `readingsGraph`, `roomGeneralData`
- **Componente:** `ReadingsChart` (chart-statistics)

---

## Layout padre

El `layout.tsx` configura el sidebar con las siguientes secciones:

- Rooms (`/rooms`)
- Monitoreo (`/monitoreo`)
- Análisis → Indicadores, Picos Históricos, Estadísticas
- Alertas (`/alertas`)

> **Nota:** La ruta COVID está comentada en el sidebar (`// covid: '/ocupacional/dashboard/covid'`) pero existe y funciona.
