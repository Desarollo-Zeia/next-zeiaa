# Mejoras: Energy Distorsión

## Problemas Identificados (Vercel Best Practices)

| # | Problema | Severidad | Regla Vercel |
|---|----------|-----------|--------------|
| 1 | WATERFALL - 2 llamadas secuenciales | 🟡 MEDIA | `server-parallel-fetching` |
| 2 | Sin componente de datos independiente - todo en una función | 🟡 MEDIA | Composición |
| 3 | Skeleton básico - no es real | 🟡 MEDIA | UX |
| 4 | Mucho código comentado | 🟢 BAJA | Clean code |
| 5 | Panel hardcodeado `panel = '1'` | 🟡 MEDIA | Hardcoded |
| 6 | Sin React.cache() en servicios | 🟡 MEDIA | `server-cache-react` |
| 7 | Serialización excesiva | 🟡 MEDIA | `server-serialization` |

---

## Detalle de Problemas

### Problema 1: WATERFALL (líneas 30-35)

```typescript
// ❌ 2 llamadas SECUENCIALES
const headquarters = await getHeadquarters(authToken!)
const firstHeadquarter = headquarter || results[0].id.toString()

// Espera que termine la 1
const armonicsGraphReadings = await armonicsGraph({...})
```

**Tiempo total = ~2 × latency**

---

### Problema 2: Todo en una función grande

```typescript
// ❌ Una sola función que hace TODO
async function DistorsionContent({ searchParams }: SearchParams) {
  // 1. Parsea params
  // 2. Fetch headquarters
  // 3. Fetch graph data
  // 4. Renderiza TODOS los componentes UI
  // 5. Lógica condicional
}
```

**Solución:** Extraer componentes para paralelización.

---

### Problema 3: Skeleton básico (línea 101)

```typescript
// ❌ No es un skeleton real
<Suspense fallback={<div>Cargando...</div>}>
```

**Solución:** Crear `DistorsionSkeleton` con la forma exacta de los datos.

---

## Plan de Implementación

### Fase 1: Crear skeleton real

**Archivo nuevo:** `app/ui/energia/distorsion/skeletons.tsx`

```typescript
export function DistorsionSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Filters skeleton */}
      <div className="h-12 bg-gray-200 rounded mb-4"></div>
      {/* Chart skeleton */}
      <div className="h-[400px] bg-gray-200 rounded"></div>
    </div>
  )
}
```

### Fase 2: Eliminar waterfall

```typescript
// ✅ CORRECTO - paralela si fuera posible
// NOTA: La segunda llamada depende del ID de la primera
// Se podría usar composición de componentes
```

### Fase 3: Limpieza

- Eliminar código comentado
- Eliminar panel hardcodeado

---

## Estado

- [x] Fase 1: Crear skeleton real
- [x] Fase 2: Eliminar waterfall (prefetch condicional)
- [x] Fase 3: Limpieza (comentarios, hardcoded)
- [x] Fase 4: React.cache() en servicios
