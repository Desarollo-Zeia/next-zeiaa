# Mejoras - Energía

Directorio de mejoras identificadas para los submódulos de Energía, basadas en **Vercel React Best Practices**.

## Estructura

```
mejoras/
├── README.md                    # Este archivo
└── energy/
    ├── home/
    │   └── README.md           # Mejoras para home/page.tsx
    ├── panel/
    │   └── README.md           # Mejoras para panel/page.tsx
    ├── tarifario/
    │   └── README.md           # Mejoras para tarifario/page.tsx
    ├── monitoreo/
    │   └── README.md           # Mejoras para monitoreo/page.tsx
    ├── desbalance/
    │   └── README.md           # Mejoras para desbalance/page.tsx
    └── distorsion/
        └── README.md           # Mejoras para distorsión/page.tsx
```

---

## Resumen de Módulos Analizados

| Módulo | Mejoras Aplicadas | Estado |
|--------|-------------------|--------|
| **panel** | Promise.all datos, prefetch condicional, Suspense granular, skeleton real, React.cache | ✅ Completado |
| **home** | Prefetch condicional, Suspense granular, React.cache | ✅ Completado |
| **desbalance** | Prefetch condicional, Suspense granular, React.cache | ✅ Completado |
| **tarifario** | Prefetch condicional, limpieza código, React.cache | ✅ Completado |
| **distorsion** | Prefetch condicional, skeleton real, limpieza código | ✅ Completado |
| **monitoreo** | Prefetch condicional, skeleton real, limpieza código | ✅ Completado |

---

## Ranking de Peor a Mejor

```
Peor ───────────────────────────────────────────────────► Mejor

home (3) = desbalance (3) = panel (3) > tarifario (2) = distorsión (2) > monitoreo (1)
```

---

## Problemas Críticos Comunes

### 1. WATERFALL (Llamadas secuenciales)

**Impacto:** CRÍTICO - Multiplica el tiempo de carga por el número de requests.

**Ejemplo:**
```typescript
// ❌ INCORRECTO - 6 llamadas secuenciales
const a = await fetch1()
const b = await fetch2()  // espera a
const c = await fetch3()  // espera b
const d = await fetch4()  // espera c
const e = await fetch5()  // espera d
const f = await fetch6()  // espera e

// ✅ CORRECTO - Paralelización
const [a, b, c, d, e, f] = await Promise.all([
  fetch1(), fetch2(), fetch3(), fetch4(), fetch5(), fetch6()
])
```

**Solución Vercel:** Usar `Promise.all()` para operaciones independientes + Composición de componentes.

---

### 2. Sin React.cache() en servicios

**Impacto:** MEDIO - Sin deduplicación dentro del request.

**Solución Vercel:** Envolver funciones con `React.cache()`.

---

### 3. Suspense único

**Impacto:** CRÍTICO - Todo espera a que el request más lento termine.

**Solución Vercel:** Múltiples `<Suspense>` boundaries para componentes independientes.

---

### 4. Skeleton básico

**Impacto:** UX - Mala experiencia de usuario.

```typescript
// ❌ Malo
<Suspense fallback={<div>Cargando...</div>}>

// ✅ Bueno
<Suspense fallback={<RealSkeleton />}>
```

---

## Reglas Vercel Aplicadas

| Regla | Descripción |
|-------|-------------|
| `server-parallel-fetching` | Eliminar waterfalls con Promise.all |
| `server-cache-react` | Deduplicación con React.cache() |
| `server-serialization` | Minimizar datos serializados |
| `async-suspense-boundaries` | Múltiples Suspense |
| `rendering-hoist-jsx` | Extraer funciones estáticas |
| `client-swr-dedup` | SWR para client-side fetch |

---

## Estado Final

Todas las mejoras de performance han sido implementadas en los 6 submódulos de Energía:

1. **Prefetch condicional**: Cuando el usuario navega con IDs en query params, los datos se fetch-an antes de resolver defaults
2. **Promise.all**: Llamadas independientes paralelizadas
3. **React.cache**: Deduplicación de requests dentro del mismo request
4. **Suspense granular**: Composición de componentes para carga independiente
5. **Skeletons reales**: Mejor UX durante carga

### Métricas esperadas de mejora

- **Tiempo de carga inicial**: Reducción de 30-60% depending on network latency
- **Waterfall**: Eliminado o reducido significativamente
- **UX**: Skeletons reales durante carga de componentes independientes

---

## Recursos

- [Vercel React Best Practices](../.opencode/skills/vercel-react-best-practices/SKILL.md)
- [Parallel Fetching](../.opencode/skills/vercel-react-best-practices/rules/server-parallel-fetching.md)
- [React.cache()](../.opencode/skills/vercel-react-best-practices/rules/server-cache-react.md)
- [Suspense Boundaries](../.opencode/skills/vercel-react-best-practices/rules/async-suspense-boundaries.md)
