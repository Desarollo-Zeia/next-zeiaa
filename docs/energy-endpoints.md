# Documentación de Endpoints - Servicios de Energía

**Ubicación:** `app/services/energy/`

---

## Tabla de Contenidos

1. [app/services/energy/data.ts](#1-appservicesenergydatats)
2. [app/services/energy/enterprise/data.ts](#2-appservicesenergyenterprisedatats)
3. [app/services/energy/tarifario/data.ts](#3-appservicesenergytarifariodatats)
4. [app/services/energy/monitoreo/data.ts](#4-appservicesenergymonitoreodatats)
5. [app/services/energy/distorsion/data.ts](#5-appservicesenergydistorsiondatats)
6. [app/services/energy/desbalance/data.ts](#6-appservicesenergydesbalancedatats)
7. [app/services/energy/alerts/data.ts](#7-appservicesenergyalertsdatats)

---

## Notas Generales

- Todos los endpoints son **Server Actions** (`'use server'`).
- Los endpoints con `Excel` en el nombre retornan un **Blob/Excel** y **no usan caché**.
- Los demás endpoints utilizan `unstable_cache` o `cache` de React con `cacheLife('minutes')` o `cacheLife('hours')`.
- Los parámetros de tipo `array` se envían como **query params repetidos** (ej: `?status=a&status=b`).
- La estructura exacta de respuesta de la mayoría depende del backend (no están tipadas en estos archivos del cliente).

---

## 1. app/services/energy/data.ts

### `consume`

Obtiene lecturas/consumo de un punto de medición específico.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/{panelId}/measurement_points/{point}/readings` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `panelId` | `string` | Sí | ID del panel eléctrico |
| `point` | `string` | Sí | Punto de medición |
| `token` | `string` | No | Token de autenticación |
| `date_after` | `string` | No | Fecha inicio (default: `START_DATE`) |
| `date_before` | `string` | No | Fecha fin (default: `START_DATE`) |
| `unit` | `string` | No | Unidad de medida |
| `page` | `string` | No | Página |
| `category` | `string` | No | Categoría |

**Respuesta:**
Respuesta directa del backend (lecturas/consumo).

---

### `consumeGraph`

Obtiene datos para gráfico de consumo.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/{panelId}/measurement_points/{point}/readings/graph` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `panelId` | `string` | Sí | ID del panel |
| `point` | `string` | Sí | Punto de medición |
| `token` | `string` | No | Token |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |
| `indicador` | `string` | No | Indicador |
| `unit` | `string` | No | Unidad |
| `last_by` | `string` | No | Agrupación temporal |
| `category` | `string` | No | Categoría |

**Respuesta:**
Datos para gráfico de consumo.

---

### `consumeGraphSpecific`

Obtiene datos para gráfico específico de consumo.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/{panelId}/measurement_points/{point}/readings/graph-especific` |

**Parámetros:** Igual que `consumeGraph`.

**Respuesta:**
Datos para gráfico específico.

---

### `consumeExcel`

Descarga reporte de consumo en formato Excel.

> ⚠️ **Sin caché:** Los Blobs no pueden ser serializados por `unstable_cache`.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/{panelId}/readings/report` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `panelId` | `string` | Sí | ID del panel |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |
| `unit` | `string` | No | Unidad |

> El token se obtiene automáticamente vía `getToken()`.

**Respuesta:**
Archivo Excel (Blob).

---

## 2. app/services/energy/enterprise/data.ts

### `getHeadquarters`

Obtiene la lista de sedes del usuario autenticado.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/user/headquarters/` |

**Parámetros:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `token` | `string` | Sí | Token de autenticación |

**Respuesta:**
Lista de sedes del usuario.

---

### `getFavorites`

Obtiene la lista de puntos favoritos del usuario.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/favorite-points` |

**Parámetros:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `token` | `string` | Sí | Token de autenticación |

**Respuesta:**
Lista de puntos favoritos.

---

### `getEnergyMeasurementPointPanels`

Obtiene los puntos de medición de una sede específica.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/measurement-points/` |

**Parámetros:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `token` | `string` | Sí | Token de autenticación |

**Respuesta:**
Puntos de medición de la sede.

---

## 3. app/services/energy/tarifario/data.ts

### `consumptionCalculator`

Calcula el consumo tarifario de una sede.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/rate-consumption` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `token` | `string` | No | Token |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |

**Respuesta:**
Cálculo de consumo tarifario.

---

### `consumptionCalculatorMonthly`

Calcula el consumo mensual en un rango de fechas.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/rate-consumption/date-range` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `token` | `string` | No | Token |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |

**Respuesta:**

```json
{
  "consumption": null | object,
  "detail": "string"
}
```

---

### `consumptionInvoice`

Obtiene datos de facturación/ciclo de consumo.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/rate-consumption/cycle` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `token` | `string` | No | Token |

**Respuesta:**
Datos de facturación/ciclo de consumo.

---

### `consumptionTable`

Obtiene tabla resumen de consumo (paginada).

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/rate-consumption/resume` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `token` | `string` | No | Token |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |
| `page` | `string` | No | Página |

**Respuesta:**
Tabla resumen de consumo (paginada).

---

### `consumptionGraph`

Obtiene datos históricos para gráfico tarifario.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/rate-consumption/historical` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `token` | `string` | No | Token |
| `group_by` | `string` | No | Agrupación (ej: día, mes) |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |

**Respuesta:**
Datos históricos para gráfico tarifario.

---

### `consumptionTariff`

Obtiene el detalle de tarifas aplicadas.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/rate-consumption/detail-tariff` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `token` | `string` | No | Token |

**Respuesta:**
Detalle de tarifas aplicadas.

---

## 4. app/services/energy/monitoreo/data.ts

### `monitoringGraph`

Obtiene datos para gráfico de potencias.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/powers/graph` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `token` | `string` | No | Token |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |
| `group_by` | `string` | No | Agrupación |

**Respuesta:**
Datos para gráfico de potencias.

---

### `monitoringLastThree`

Obtiene las últimas 3 potencias excedidas.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/powers/last-exceeded` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `token` | `string` | No | Token |

**Respuesta:**
Últimas 3 potencias excedidas.

---

### `exceeded`

Obtiene lista paginada de potencias excedidas.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/powers/all-exceeded` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `token` | `string` | No | Token |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |
| `page` | `string` | No | Página |

**Respuesta:**
Lista paginada de potencias excedidas.

---

### `exceededExcel`

Descarga reporte de potencias excedidas en Excel.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/powers/report-exceeded` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |

> El token se obtiene internamente del auth.

**Respuesta:**
Archivo Excel con excedentes.

---

### `alertsExcel` (Legacy Ocupacional)

Descarga reporte de alertas ocupacionales en Excel.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/alerts/api/room/{room}/report/` |
| **Base URL** | `baseUrl` (Ocupacional) |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `room` | `string` | No | ID de la sala |
| `indicator` | `Indicator` | Sí | Indicador |
| `unit` | `Unit` | Sí | Unidad |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |

**Respuesta:**
Archivo Excel de alertas ocupacionales.

---

## 5. app/services/energy/distorsion/data.ts

### `armonics`

Obtiene lista paginada de distorsiones armónicas.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/harmonic-distortion/list` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `token` | `string` | No | Token |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |
| `data_type` | `string` | No | Tipo de dato |
| `page` | `string` | No | Página |

**Respuesta:**
Lista paginada de distorsiones armónicas.

---

### `armonicsGraph`

Obtiene datos para gráfico de distorsión armónica.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/harmonic-distortion/graph` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `token` | `string` | No | Token |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |
| `data_type` | `string` | No | Tipo de dato |

**Respuesta:**
Datos para gráfico de distorsión armónica.

---

### `armonicsExcel`

Descarga reporte de distorsiones armónicas en Excel.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/harmonic-distortion/report` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |
| `data_type` | `string` | No | Tipo de dato |

**Respuesta:**
Archivo Excel de distorsiones armónicas.

---

## 6. app/services/energy/desbalance/data.ts

### `current`

Obtiene lista de desbalances de corriente.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/{panelId}/measurement_point/{point}/current-imbalanced` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `panelId` | `string` | Sí | ID del panel |
| `point` | `string` | Sí | Punto de medición |
| `token` | `string` | No | Token |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |
| `status` | `string` | No | Estado |
| `page` | `string` | No | Página |

**Respuesta:**
Lista de desbalances de corriente.

---

### `currentGraph`

Obtiene datos para gráfico de contadores de desbalance de corriente.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/{panelId}/measurement_point/{point}/unbalanced-current/counters-graph` |

**Parámetros:** Igual que `current`.

**Respuesta:**
Datos para gráfico de contadores de desbalance de corriente.

---

### `voltage`

Obtiene lista de desbalances de voltaje.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/{panelId}/measurement_point/{point}/voltage-imbalanced` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `panelId` | `string` | Sí | ID del panel |
| `point` | `string` | Sí | Punto de medición |
| `token` | `string` | No | Token |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |
| `status` | `string` | No | Estado |
| `page` | `string` | No | Página |

**Respuesta:**
Lista de desbalances de voltaje.

---

### `voltageGraph`

Obtiene datos para gráfico de contadores de desbalance de voltaje.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/{panelId}/measurement_point/{point}/unbalanced-voltage/counters-graph` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `panelId` | `string` | Sí | ID del panel |
| `point` | `string` | Sí | Punto de medición |
| `token` | `string` | No | Token |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |
| `status` | `string` | No | Estado |

**Respuesta:**
Datos para gráfico de contadores de desbalance de voltaje.

---

### `threeMostUnbalanced`

Obtiene los 3 puntos más desbalanceados.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/headquarter/{headquarterId}/electrical_panel/most-three-unbalanced` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `headquarterId` | `string` | Sí | ID de la sede |
| `token` | `string` | No | Token |

**Respuesta:**
Los 3 puntos más desbalanceados.

---

## 7. app/services/energy/alerts/data.ts

### `getVoltageFluctuationAlerts`

Obtiene alertas de fluctuación de voltaje con filtros.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/alerts/energy/voltage-fluctuation/` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `token` | `string` | Sí | Token |
| `device` | `string` | No | Dispositivo |
| `measurement_point` | `string` | No | Punto de medición |
| `fluctuation_subtype` | `string \| string[]` | No | Subtipo (puede repetirse) |
| `status` | `string \| string[]` | No | Estado (puede repetirse) |
| `alert_status` | `string \| string[]` | No | Estado de alerta (puede repetirse) |
| `phase_type` | `string \| string[]` | No | Tipo de fase (puede repetirse) |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |
| `time_after` | `string` | No | Hora inicio |
| `time_before` | `string` | No | Hora fin |
| `page` | `string` | No | Página |

**Respuesta:**

```json
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": []
}
```

> En caso de página inválida (404 con mensaje "Página inválida"), retorna array vacío.

---

### `getVoltageFluctuationLatestByPhase`

Obtiene las últimas alertas de fluctuación de voltaje por fase.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/alerts/energy/voltage-fluctuation/latest-by-phase/` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `token` | `string` | Sí | Token |
| `measurement_point` | `string` | No | Punto de medición |
| `fluctuation_subtype` | `string` | No | Subtipo |

**Respuesta:**
Últimas alertas por fase.

---

### `getVoltageFluctuationAlertDetail`

Obtiene el detalle completo de una alerta específica.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/alerts/energy/voltage-fluctuation/{alert_id}/detail/` |

**Parámetros:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `alert_id` | `string \| number` | Sí | ID de la alerta |
| `token` | `string` | Sí | Token |

**Respuesta:**
Detalle completo de la alerta.

---

### `getVoltageFluctuationAlertsExcel`

Descarga reporte de alertas de fluctuación de voltaje en Excel.

> ⚠️ **Sin caché:** Los Blobs no pueden ser serializados por `unstable_cache`.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/alerts/energy/voltage-fluctuation/report/` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `device` | `string` | No | Dispositivo |
| `measurement_point` | `string` | No | Punto de medición |
| `fluctuation_subtype` | `string \| string[]` | No | Subtipo |
| `status` | `string \| string[]` | No | Estado |
| `alert_status` | `string \| string[]` | No | Estado de alerta |
| `phase_type` | `string \| string[]` | No | Tipo de fase |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |
| `time_after` | `string` | No | Hora inicio |
| `time_before` | `string` | No | Hora fin |

> El token se obtiene automáticamente vía `getToken()`.

**Respuesta:**
Archivo Excel.

---

### `getVoltageFluctuationLatestByPhaseExcel`

Descarga reporte de últimas alertas por fase en Excel.

> ⚠️ **Sin caché:** Los Blobs no pueden ser serializados por `unstable_cache`.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/api/v1/alerts/energy/voltage-fluctuation/latest-by-phase/report/` |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `measurement_point` | `string` | No | Punto de medición |
| `fluctuation_subtype` | `string` | No | Subtipo |

> El token se obtiene automáticamente vía `getToken()`.

**Respuesta:**
Archivo Excel.

---

### `alerts` (Legacy Ocupacional)

Obtiene alertas del módulo ocupacional.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/alerts/api/room/{roomId}/alerts` |
| **Base URL** | `baseUrl` (Ocupacional) |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `roomId` | `string \| number` | Sí | ID de la sala |
| `indicator` | `string` | Sí | Indicador |
| `unit` | `string` | Sí | Unidad |
| `token` | `string` | No | Token |
| `page` | `string` | No | Página |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |
| `status` | `string` | No | Estado |

**Respuesta:**
Lista de alertas ocupacionales.

---

### `alertsAmbiental` (Legacy Ambiental)

Obtiene alertas del módulo ambiental.

| Aspecto | Detalle |
|---------|---------|
| **Método** | `GET` |
| **URL** | `/alerts/api/ambiental/point/{roomId}/alerts/` |
| **Base URL** | `baseUrlAmbiental` (Ambiental) |

**Parámetros (query string):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `roomId` | `string \| number` | Sí | ID del punto |
| `indicator` | `string` | Sí | Indicador |
| `unit` | `string` | Sí | Unidad |
| `token` | `string` | Sí | Token |
| `page` | `string` | Sí | Página |
| `date_after` | `string` | No | Fecha inicio |
| `date_before` | `string` | No | Fecha fin |
| `status` | `string` | No | Estado |

**Respuesta:**
Lista de alertas ambientales.
