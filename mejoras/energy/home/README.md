# Mejoras: Energy Home

## Problemas Identificados (Vercel Best Practices)

| # | Problema | Severidad | Regla Vercel |
|---|----------|-----------|--------------|
| 1 | WATERFALL en `resolveFilterIds` - 3 llamadas secuenciales | 🔴 CRÍTICO | `server-parallel-fetching` |
| 2 | WATERFALL en `FiltersSection` - hace las mismas 3 llamadas que `resolveFilterIds` | 🔴 CRÍTICO | `server-parallel-fetching` |
| 3 | Sin React.cache() en servicios de filters | 🟡 MEDIO | `server-cache-react` |
| 4 | Serialización optimizable - se puede reducir payload hacia componentes cliente | 🟡 MEDIO | `server-serialization` |
| 5 | Client-side fetch sin deduplicación en graph.tsx | 🟢 BAJO | `client-swr-dedup` |

---

## Detalle de Problemas

### Problema 1: WATERFALL en resolveFilterIds

**Ubicación:** líneas 55-67

```typescript
// ❌ INCORRECTO - 3 llamadas secuenciales
const headquarters = await getHeadquarters(token)
const headquarterId = headquarter || headquarters.results[0]?.id.toString()

const measurementPointsPanels = await getEnergyMeasurementPointPanels({ headquarterId, token })
const panelId = panel || measurementPointsPanels?.results[0]?.id.toString()

const measurementPoints = await getMeasurementPoints({ electricalpanelId: panelId, token })
const pointId = point || measurementPoints?.results[0]?.measurement_points[0]?.id.toString()
```

**Solución:** La lógica de "si no hay parámetro, tomar el primero" requiere los datos antes de continuar. Se debe usar composición de componentes + Suspense.

---

### Problema 2: Duplicación de lógica

`resolveFilterIds` y `FiltersSection` hacen las mismas 3 llamadas a la API.

---

### Problema 3: Sin React.cache() en servicios

**Archivo:** `app/services/filters/data.ts`

Los servicios no usan `React.cache()` para deduplicar dentro del request.

---

### Problema 4: Serialización excesiva

```typescript
// ⚠️ Se serializan estructuras completas hacia componentes cliente
// Se puede mapear a solo los campos usados por filtros/tablas/gráficos.
```

---

## Plan de Implementación

### Fase 1: Agregar React.cache() a servicios

**Archivos a modificar:**
- `app/services/filters/data.ts`

```typescript
import { cache } from 'react'

export const getHeadquartersCached = cache(async (token: string) => {
  'use cache'
  cacheLife('minutes')
  return await fetchWithAuthEnergy('/api/v1/user/headquarters/', {}, token)
})

export const getMeasurementPointsCached = cache(async ({ electricalpanelId, token }: { electricalpanelId: string, token: string }) => {
  'use cache'
  cacheLife('minutes')
  return await fetchWithAuthEnergy(`/api/v1/electrical-panel/${electricalpanelId}/devices/measurement-points/`, {}, token)
})
```

### Fase 2: Eliminar waterfall en page.tsx

**Estrategia:** 
1. No resolver IDs en page.tsx - pasar parámetros directamente
2. Dejar que cada componente resuelva sus propios defaults
3. Usar Suspense para carga independiente
4. Compartir promesa de datos entre componentes

### Fase 3: Minimizar serialización

Pasar solo los campos necesarios a los componentes hijos.

---

## Estado

- [x] Fase 1: React.cache() en servicios
- [x] Fase 2: Eliminar fetch duplicado en filtros
- [x] Fase 3: Prefetch condicional + Suspense granular
- [ ] Fase 4: Minimizar serialización (opcional)
- [ ] Fase 5: Client-side fetch (opcional)
