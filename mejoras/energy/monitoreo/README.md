# Mejoras: Energy Monitoreo

## Problemas Identificados (Vercel Best Practices)

| # | Problema | Severidad | Regla Vercel |
|---|----------|-----------|--------------|
| 1 | WATERFALL - 1 llamada secuencial | 🟡 MEDIA | `server-parallel-fetching` |
| 2 | Suspense único - skeleton básico | 🟡 MEDIA | `async-suspense-boundaries` |
| 3 | Mucho código comentado | 🟢 BAJA | Clean code |
| 4 | Panel hardcodeado `panel = '1'` | 🟡 MEDIA | Hardcoded |
| 5 | Sin React.cache() en servicios | 🟡 MEDIA | `server-cache-react` |
| 6 | Serialización excesiva | 🟡 MEDIA | `server-serialization` |

---

## Detalle de Problemas

### Problema 1: WATERFALL (líneas 39-42)

```typescript
// ❌ 1 llamada SECUENCIAL
const authToken = await getToken()
const headquarters = await getHeadquarters(authToken!)
const firstHeadquarter = headquarter || results[0].id.toString()
```

**NOTA:** Este es el MEJOR de todos los módulos - solo 1 llamada secuencial antes de Promise.all.

---

### Problema 2: Skeleton básico (línea 87)

```typescript
// ❌ No es un skeleton real
<Suspense fallback={<div>Cargando...</div>}>
```

---

## Plan de Implementación

### Fase 1: Crear skeleton real

```typescript
// app/ui/energia/monitoreo/skeletons.tsx
export function MonitoreoSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 rounded mb-4"></div>
      <div className="h-[400px] bg-gray-200 rounded"></div>
    </div>
  )
}
```

### Fase 2: Eliminar panel hardcodeado

Cambiar `panel = '1'` por obtener el primer panel disponible.

### Fase 3: Limpieza

- Eliminar código comentado

---

## Estado

- [x] Fase 1: Crear skeleton real
- [x] Fase 2: Eliminar panel hardcodeado
- [x] Fase 3: Prefetch condicional + Suspense
- [x] Fase 4: React.cache() en servicios
