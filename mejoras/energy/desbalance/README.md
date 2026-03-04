# Mejoras: Energy Desbalance

## Problemas Identificados (Vercel Best Practices)

| # | Problema | Severidad | Regla Vercel |
|---|----------|-----------|--------------|
| 1 | WATERFALL - 3 llamadas secuenciales | 🔴 CRÍTICO | `server-parallel-fetching` |
| 2 | Mejora de legibilidad: extraer lógica condicional fuera de Promise.all | 🟢 BAJA | Clean code |
| 3 | Sin React.cache() en servicios | 🟡 MEDIA | `server-cache-react` |
| 4 | Serialización excesiva | 🟡 MEDIA | `server-serialization` |

---

## Detalle de Problemas

### Problema 1: WATERFALL (líneas 34-41)

```typescript
// ❌ 3 llamadas SECUENCIALES
const headquarters = await getHeadquarters(authToken!)
const headquarterId = headquarter || headquarters.results[0]?.id.toString()

// Espera que termine la 1
const measurementPointsPanels = await getEnergyMeasurementPointPanels({ headquarterId, token: authToken! })
const panelId = panel || measurementPointsPanels?.results[0]?.id.toString()

// Espera que termine la 2
const measurementPoints = await getMeasurementPoints({ electricalpanelId: panelId, token: authToken! })
const pointId = point || measurementPoints?.results[0]?.measurement_points[0]?.id.toString()
```

---

### Problema 2: Mejora de legibilidad en Promise.all (líneas 43-62)

```typescript
// ⚠️ El ternario está DENTRO del Promise.all
const [threeUnbalanced, chartData] = await Promise.all([
  threeMostUnbalanced({ headquarterId, token: authToken! }),
  metric === 'current'
    ? currentGraph({...})
    : voltageGraph({...})
])
```

**Mejor estructura:**

```typescript
// ✅ CORRECTO: Llamar solo la función necesaria
const chartDataPromise = metric === 'current' 
  ? currentGraph({...})
  : voltageGraph({...})

const [threeUnbalanced, chartData] = await Promise.all([
  threeMostUnbalanced({ headquarterId, token: authToken! }),
  chartDataPromise
])
```

---

## Plan de Implementación

### Fase 1: Eliminar waterfall

**Estrategia:** Paralelizar las 3 llamadas o usar composición de componentes.

### Fase 2: Extraer lógica condicional

Mover el ternary fuera del Promise.all.

### Fase 3: Agregar React.cache() a servicios

---

## Estado

- [x] Fase 1: Eliminar waterfall (prefetch condicional)
- [x] Fase 2: Extraer lógica condicional
- [x] Fase 3: React.cache() en servicios
- [x] Fase 3: React.cache() en servicios
