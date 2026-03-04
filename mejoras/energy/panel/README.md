# Mejoras: Energy Panel

## Problemas Identificados (Vercel Best Practices)

| # | Problema | Severidad | Regla Vercel |
|---|----------|-----------|--------------|
| 1 | WATERFALL EXTREMO - 6 llamadas secuenciales | 🔴 CRÍTICO | `server-parallel-fetching` |
| 2 | Sin Suspense boundaries - todo espera en un solo Suspense | 🔴 CRÍTICO | `async-suspense-boundaries` |
| 3 | Funciones helper de fecha dentro del componente | 🟡 MEDIA | `rendering-hoist-jsx` |
| 4 | Sin React.cache() en servicios de filters | 🟡 MEDIO | `server-cache-react` |
| 5 | console.log en producción | 🟡 MEDIA | Clean code |
| 6 | Código comentado | 🟢 BAJA | Clean code |
| 7 | Serialización excesiva | 🟡 MEDIA | `server-serialization` |

---

## Detalle de Problemas

### Problema 1: WATERFALL EXTREMO (líneas 83-135)

```typescript
// ❌ CRÍTICO - 6 llamadas SECUENCIALES

// Llamada 1
const headquarters = await getHeadquarters(authToken!)

// Llamada 2 - espera que termine la 1
const measurementPointsPanels = await getEnergyMeasurementPointPanels({...})

// Llamada 3 - espera que termine la 2
const measurementPoints = await getMeasurementPoints({...})

// Llamada 4 - espera que terminen 1,2,3
const dashboardTableReadings = await dashboardTable({...})

// Llamada 5 - espera que terminen 1,2,3
const dashboardPorcentageGraph = await porcentageGraph({...})

// Llamada 6 - espera que terminen 1,2,3
const consumeGraphReadings = await consumeGraph({...})
```

**Tiempo total = ~6 × latency** (vs ~150-200ms con paralelización)

---

### Problema 2: Sin Suspense Boundaries (líneas 218-222)

```typescript
// ❌ Todo el dashboard es UN Solo Suspense
<Suspense fallback={<DashboardSkeleton />}>
  <DashboardContent searchParams={searchParams} />
</Suspense>
```

**Problema:** Cuando `getHeadquarters()` termina (100ms), pero `consumeGraph()` tarda 2s, el usuario ve el skeleton por 2s. Los filtros podrían mostrarse inmediatamente.

---

### Problema 3: Funciones helper en componente (líneas 22-49)

```typescript
// ❌ Estas funciones NO pertenecen en un archivo de página
function isLeapYear(year: number): boolean {...}
function getLastDayOfMonth(year: number, month: number): number {...}
function getMonthDateRange(year: number, month: number): string {...}
```

**Solución:** Mover a `app/utils/date-utils.ts`

---

### Problema 4: console.log en producción

```typescript
// ❌ Línea 141
console.log(dashboardTableReadings)
```

---

### Problema 5: Código comentado

```typescript
// ❌ Línea 149
{/* <TodayAlertBanner alertToday={alertToday} /> */}
```

---

## Plan de Implementación

### Fase 1: Mover funciones helper a utils

**Archivo nuevo:** `app/utils/date-utils.ts`

```typescript
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

export function getLastDayOfMonth(year: number, month: number): number {
  const daysInMonth: { [key: number]: number } = {
    1: 31, 2: isLeapYear(year) ? 29 : 28, 3: 31, 4: 30,
    5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31,
  }
  return daysInMonth[month]
}

export function getMonthDateRange(year: number, month: number): string {
  const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
  const lastDay = getLastDayOfMonth(year, month)
  const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`
  return `${startDate}:${endDate}`
}
```

### Fase 2: Eliminar waterfall - Paralelización

**Estrategia:**
1. Agrupar las llamadas independientes en Promise.all
2. Las llamadas que dependen de ID (panels → points) deben ser secuenciales solo dentro de su grupo
3. Usar múltiples Suspense boundaries

```typescript
// ✅ CORRECTO - Dependencias primero, luego paralelizar independientes
const headquarters = await getHeadquarters(authToken!)
const measurementPointsPanels = await getEnergyMeasurementPointPanels({ headquarterId: firstHeadquarter, token: authToken! })
const measurementPoints = await getMeasurementPoints({ electricalpanelId: firstPanel, token: authToken! })

const [dashboardTableReadings, dashboardPorcentageGraph, consumeGraphReadings] = await Promise.all([
  dashboardTable({...}),
  porcentageGraph({...}),
  consumeGraph({...})
])
```

### Fase 3: Múltiples Suspense Boundaries

```typescript
// ✅ CORRECTO - Múltiples Suspense
export default function Page({ searchParams }: SearchParams) {
  return (
    <div className="relative p-6 flex flex-col justify-center gap-8">
      <Suspense fallback={<FiltersSkeleton />}>
        <FiltersSection ... />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <ChartSection ... />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <TableSection ... />
      </Suspense>
    </div>
  )
}
```

### Fase 4: Limpieza

- Eliminar console.log (línea 141)
- Eliminar código comentado (línea 149)
- Agregar React.cache() a servicios de filters

---

## Estado

- [ ] Fase 1: Mover funciones helper a utils
- [x] Fase 2: Paralelizar llamadas de datos (tabla/graficos)
- [x] Fase 3: Múltiples Suspense boundaries
- [x] Fase 4: Limpieza (console.log, código comentado)
- [x] Fase 5: React.cache() en servicios
