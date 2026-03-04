# API Endpoints

Este documento contiene el mapeo completo de todos los endpoints consumidos en la aplicación.

---

## ENERGY API (baseUrlEnergy)

### Tarifario

| Endpoint | Función | Archivo |
|----------|---------|---------|
| `/api/v1/headquarter/{headquarterId}/electrical_panel/rate-consumption` | consumptionCalculator | `services/energy/tarifario/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/rate-consumption/monthly` | consumptionCalculatorMonthly | `services/energy/tarifario/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/rate-consumption/cycle` | consumptionInvoice | `services/energy/tarifario/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/rate-consumption/resume` | consumptionTable | `services/energy/tarifario/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/rate-consumption/historical` | consumptionGraph | `services/energy/tarifario/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/rate-consumption/detail-tariff` | consumptionTariff | `services/energy/tarifario/data.ts` |

### Panel / Mediciones

| Endpoint | Función | Archivo |
|----------|---------|---------|
| `/api/v1/headquarter/{headquarterId}/electrical_panel/{panelId}/devices/measurement-points/list/` | dashboardTable | `services/panel/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/{panelId}/consumption-distribution/` | porcentageGraph | `services/panel/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/{panelId}/measurement_points/{point}/readings` | consume | `services/energy/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/{panelId}/measurement_points/{point}/readings/graph` | consumeGraph | `services/energy/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/{panelId}/measurement_points/{point}/readings/report` | consumeExcel | `services/energy/data.ts` |
| `/api/v1/electrical-panel/{electricalpanelId}/devices/measurement-points/` | getMeasurementPoints | `services/filters/data.ts` |

### Distorsión Armónica

| Endpoint | Función | Archivo |
|----------|---------|---------|
| `/api/v1/headquarter/{headquarterId}/electrical_panel/harmonic-distortion/list` | armonics | `services/energy/distorsion/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/harmonic-distortion/graph` | armonicsGraph | `services/energy/distorsion/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/harmonic-distortion/report` | armonicsExcel | `services/energy/distorsion/data.ts` |

### Desbalance

| Endpoint | Función | Archivo |
|----------|---------|---------|
| `/api/v1/headquarter/{headquarterId}/electrical_panel/{panelId}/measurement_point/{point}/current-imbalanced` | current | `services/energy/desbalance/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/{panelId}/measurement_point/{point}/unbalanced-current/counters-graph` | currentGraph | `services/energy/desbalance/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/{panelId}/measurement_point/{point}/voltage-imbalanced` | voltage | `services/energy/desbalance/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/{panelId}/measurement_point/{point}/unbalanced-voltage/counters-graph` | voltageGraph | `services/energy/desbalance/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/most-three-unbalanced` | threeMostUnbalanced | `services/energy/desbalance/data.ts` |

### Monitoreo

| Endpoint | Función | Archivo |
|----------|---------|---------|
| `/api/v1/headquarter/{headquarterId}/electrical_panel/powers/graph` | monitoringGraph | `services/energy/monitoreo/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/powers/last-exceeded` | monitoringLastThree | `services/energy/monitoreo/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/powers/all-exceeded` | exceeded | `services/energy/monitoreo/data.ts` |
| `/api/v1/headquarter/{headquarterId}/electrical_panel/powers/report-exceeded` | exceededExcel | `services/energy/monitoreo/data.ts` |
| `/api/v1/headquarter/{headquarterId}/measurement-point/{point}/historical-alerts` | dashboardTableAlerts | `services/panel/data.ts` |

### Enterprise / HQ

| Endpoint | Función | Archivo |
|----------|---------|---------|
| `/api/v1/user/headquarters/` | getHeadquarters | `services/filters/data.ts`, `services/energy/enterprise/data.ts` |
| `/api/v1/headquarter/{headquarterId}/measurement-points/` | getEnergyMeasurementPointPanels | `services/energy/enterprise/data.ts` |
| `/api/v1/enterprises/1/` | getEnergyCompanyDetails | `services/energy/enterprise/data.ts` |

---

## OCUPACIONAL API (baseUrl)

### Enterprise

| Endpoint | Función | Archivo |
|----------|---------|---------|
| `/enterprise/api/enterprise/detail/` | detail | `services/enterprise/data.ts` |
| `/enterprise/api/enterprise/room-list/` | roomsList | `services/enterprise/data.ts` |
| `/enterprise/api/enterprise/basic/room-list/` | getRooms | `services/filters/data.ts` |
| `/enterprise/api/enterprise/basic/headquearter-list/` | getHeadquartersOcupacional | `services/filters/data.ts` |
| `/enterprise/api/room/{roomId}/` | roomGeneralData | `services/readings/data.ts` |

### Readings

| Endpoint | Función | Archivo |
|----------|---------|---------|
| `/readings/api/room/{roomId}/general/last` | roomLastData | `services/readings/data.ts` |
| `/readings/api/room/{roomId}/indicator` | readingsData | `services/readings/data.ts` |
| `/readings/api/room/{roomId}/indicator/graph` | readingsReal | `services/readings/data.ts` |
| `/readings/api/room/{roomId}/indicator/metrics/low/history` | readingsPeaksTableLow | `services/readings/data.ts` |
| `/readings/api/room/{roomId}/indicator/metrics/high/history` | readingsPeaksTableHigh | `services/readings/data.ts` |
| `/readings/api/rooms/indicators/graphs` | readingsGraph | `services/readings/data.ts` |
| `/readings/api/rooms/indicators/metrics/high/history` | readingsPeaks | `services/readings/data.ts` |
| `/readings/api/room/{roomId}/covid/metrics/new-history/` | readingsCovid | `services/readings/data.ts` |
| `/readings/api/room/{roomId}/covid/baselines/` | readingsCovidBaselines | `services/readings/data.ts` |
| `/readings/api/room/{roomId}/covid/metrics/new-detail/` | readingsCovidDetail | `services/readings/data.ts` |
| `/readings/api/room/{roomId}/covid/metrics/new-detail/risks/` | riskReached | `services/readings/data.ts` |
| `/readings/api/headquarter/{headquarterId}/room/indicator/report/all-rooms` | readinsgExcel | `services/readings/data.ts` |

### Alerts

| Endpoint | Función | Archivo |
|----------|---------|---------|
| `/alerts/api/room/{roomId}/alerts` | alerts | `services/alerts/data.ts` |
| `/alerts/api/room/{roomId}/report/` | alertsExcel | `services/energy/monitoreo/data.ts` |

---

## AMBIENTAL API (baseUrlAmbiental)

### Enterprise

| Endpoint | Función | Archivo |
|----------|---------|---------|
| `/enterprise/api/enterprise/detail/` | detailAmbiental | `services/enterprise/data.ts` |
| `/enterprise/api/ambiental/enterprise/point-list/` | roomsListAmbiental | `services/enterprise/data.ts` |
| `/enterprise/api/ambiental/enterprise/basic/point-list/` | getRoomsAmbiental | `services/filters/data.ts` |
| `/enterprise/api/ambiental/enterprise/basic/headquearter-list/` | getHeadquartersAmbiental | `services/filters/data.ts` |
| `/enterprise/api/ambiental/point/{roomId}/` | roomGeneralDataAmbiental | `services/readings/data.ts` |

### Readings

| Endpoint | Función | Archivo |
|----------|---------|---------|
| `/readings/api/ambiental/point/{roomId}/general/last` | roomLastDataAmbiental | `services/readings/data.ts` |
| `/readings/api/ambiental/point/{roomId}/indicator` | readingsDataAmbiental | `services/readings/data.ts` |
| `/readings/api/ambiental/point/{roomId}/indicator/graph` | readingsGraphAmbiental | `services/readings/data.ts` |
| `/readings/api/ambiental/point/{roomId}/indicator/report` | readinsgExcelAmbiental | `services/readings/data.ts` |

### Alerts

| Endpoint | Función | Archivo |
|----------|---------|---------|
| `/alerts/api/ambiental/point/{roomId}/alerts/` | alertsAmbiental | `services/alerts/data.ts` |

---

## AUTH

| Endpoint | Función | Archivo |
|----------|---------|---------|
| `{baseUrl}/account/api/token/` | validateToken | `app/actions/validation.ts` |
| `{baseUrlAmbiental}/account/api/token/ambiental` | validateTokenAmbiental | `app/actions/validation.ts` |
| `{baseUrlEnergy}/api/v1/accounts/request-token/` | requestToken | `app/actions/validation.ts` |

---

## ACCOUNT

| Endpoint | Función | Archivo |
|----------|---------|---------|
| `/api/v1/accounts/list/` | getAccountList | `app/utils/account.ts` |
| `/api/v1/user/me/` | getCurrentUser | `app/utils/account.ts` |
| `/api/v1/user/headquarters/` | getUserHeadquarters | `app/services/filters/data.ts` |

---

## Base URLs

| Variable | Descripción |
|----------|-------------|
| `baseUrl` | API principal (Ocupacional) |
| `baseUrlEnergy` | API de Energía |
| `baseUrlAmbiental` | API Ambiental |

Las URLs base se definen en `app/lib/constant.ts`.
