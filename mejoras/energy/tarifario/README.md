# Mejoras: Energy Tarifario

## Problemas Identificados (Vercel Best Practices)

| # | Problema | Severidad | Regla Vercel |
|---|----------|-----------|--------------|
| 1 | WATERFALL - 2 llamadas secuenciales | 🟡 MEDIA | `server-parallel-fetching` |
| 2 | Mucho código comentado (20+ líneas) | 🟢 BAJA | Clean code |
| 3 | Funciones de fecha inline (monthMap) | 🟡 MEDIA | `rendering-hoist-jsx` |
| 4 | DatepickerRange comentado | 🟢 BAJA | Clean code |
| 5 | Sin React.cache() en servicios | 🟡 MEDIA | `server-cache-react` |

---

## Detalle de Problemas

### Problema 1: WATERFALL en page.tsx (líneas 62-71)

```typescript
// ❌ 2 llamadas SECUENCIALES
const headquarters = await getHeadquarters(authToken!)
const firstHeadquarter = headquarter || results[0].id.toString()

// Espera que termine la 1
const measurementPointsPanels = await getEnergyMeasurementPointPanels({
  headquarterId: firstHeadquarter,
  token: authToken!
})
const firstPanel = panel || measurementPointsPanels?.results[0]?.id.toString()
```

**NOTA:** Este es el SEGUNDO MEJOR módulo - tiene 2 llamadas secuenciales. El componente hijo TariffDataContent YA usa Promise.all correctamente.

---

### Problema 2: Funciones de fecha inline (líneas 33-56)

```typescript
// ❌ Estas funciones NO pertenecen en un archivo de página
const monthMap: Record<number, string> = {
  1: "january",
  2: "february",
  ...
}
```

---

## PUNTO POSITIVO: tariff-data.tsx

El componente hijo `tariff-data.tsx` **YA USA Promise.all CORRECTAMENTE**:

```typescript
// ✅ CORRECTO - 5 llamadas en PARALELO
const [
  calculatorResult,
  firstCalculatorResultMonthly,
  secondCalculatorResultMonthly,
  invoiceResult,
  tariffResult,
] = await Promise.all([
  consumptionCalculator({...}),
  consumptionCalculatorMonthly({ filter_month: firstmonth }),
  consumptionCalculatorMonthly({ filter_month: secondmonth }),
  consumptionInvoice({...}),
  consumptionTariff({...})
])
```

---

## Plan de Implementación

### Fase 1: Eliminar las 2 llamadas secuenciales

**Estrategia:** Paralelizar o usar composición de componentes.

### Fase 2: Eliminar código comentado

Eliminar las 20+ líneas comentadas.

### Fase 3: Mover monthMap a utils

Mover a `app/utils/date-utils.ts`

---

## Estado

- [x] Fase 1: Eliminar waterfall (prefetch condicional)
- [x] Fase 2: Eliminar código comentado
- [x] Fase 3: Corregir lógica de mes por defecto (enero)
- [x] Fase 4: React.cache() en servicios compartidos
