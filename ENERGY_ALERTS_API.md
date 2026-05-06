# Energy Alerts API

---

## Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/v1/alerts/energy/voltage-fluctuation/` | Full history, paginated and filtered |
| GET | `/api/v1/alerts/energy/voltage-fluctuation/latest-by-phase/` | Latest alert per phase (summary table) |
| GET | `/api/v1/alerts/<alert_id>/voltage-fluctuation/readings/` | All readings for the alert's day + chart thresholds |

Both require authentication and are scoped to the authenticated user's enterprise.

---

## 1. Full History — `GET /api/v1/alerts/energy/voltage-fluctuation/`

All voltage fluctuation alerts, paginated (10/page), ordered by most recent first.
Used for the **historial de alertas** page.

### Query Parameters

All optional and combinable. Multi-choice params can be repeated.

| Parameter | Type | Values |
|---|---|---|
| `device` | integer | Device ID |
| `measurement_point` | integer | Measurement point ID |
| `fluctuation_subtype` | string (repeatable) | `overvoltage` · `undervoltage` · `zero_voltage` |
| `status` | string (repeatable) | `new` · `acknowledged` · `resolved` |
| `alert_status` | string (repeatable) | `moderate` · `critical` |
| `phase_type` | string (repeatable) | `A` · `B` · `C` · `AB` · `BC` · `AC` |
| `date_after` | YYYY-MM-DD | Start date (inclusive) |
| `date_before` | YYYY-MM-DD | End date (inclusive) |
| `time_after` | HH:MM | Start time of day (inclusive) |
| `time_before` | HH:MM | End time of day (inclusive) |
| `page` | integer | Page number (default: 1) |

### Response

```json
{
  "count": 1143,
  "next": "http://localhost:8000/api/v1/alerts/energy/voltage-fluctuation/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "indicator_name": "Voltaje",
      "subindicator_name": "Voltaje de Fase A (Ua)",
      "origin": "Subtensión - Fase A",
      "date": "Jueves, 5 de Marzo de 2026",
      "time": "8:00 AM",
      "limit": 207.0,
      "value": 195.3,
      "device_id": 1,
      "device_name": "Device Name",
      "measurement_point_id": 2,
      "measurement_point_name": "MP Name",
      "status": "new",
      "alert_status": "moderate",
      "notes": "..."
    }
  ]
}
```

### Examples

```bash
# Undervoltage alerts for measurement point 2, filtered by date and time (business hours)
curl "http://localhost:8000/api/v1/alerts/energy/voltage-fluctuation/?measurement_point=2&fluctuation_subtype=undervoltage&date_after=2026-07-06&date_before=2026-07-12&time_after=08:00&time_before=18:00" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Critical alerts on phases A and AB, page 2
curl "http://localhost:8000/api/v1/alerts/energy/voltage-fluctuation/?alert_status=critical&phase_type=A&phase_type=AB&page=2" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

```javascript
const params = new URLSearchParams({
  measurement_point: 2,
  fluctuation_subtype: 'undervoltage',
  date_after: '2026-07-06',
  date_before: '2026-07-12',
  page: 1,
});

const res = await fetch(`/api/v1/alerts/energy/voltage-fluctuation/?${params}`, {
  headers: { Authorization: `Bearer ${token}` },
});
const data = await res.json();
// data.count   → total alerts matching filters
// data.next    → URL of next page or null
// data.results → alerts on this page
```

---

## 2. Latest by Phase — `GET /api/v1/alerts/energy/voltage-fluctuation/latest-by-phase/`

Returns the latest alert per phase (up to 6: A, B, C, AB, BC, AC) plus the total
alert count for today. No pagination. Used for the **summary table** (one row per phase)
and the **"Total de alertas registradas"** counter.

### Query Parameters

| Parameter | Type | Values |
|---|---|---|
| `measurement_point` | integer | Measurement point ID |
| `fluctuation_subtype` | string | `overvoltage` · `undervoltage` · `zero_voltage` |

### Response

```json
{
  "today_count": 50,
  "results": [
    {
      "id": 10,
      "indicator_name": "Voltaje",
      "subindicator_name": "Voltaje de Fase A (Ua)",
      "origin": "Subtensión - Fase A",
      "date": "Jueves, 5 de Marzo de 2026",
      "time": "8:00 PM",
      "limit": 150.0,
      "value": 200.0,
      "device_id": 1,
      "device_name": "Device Name",
      "measurement_point_id": 2,
      "measurement_point_name": "Llave general TGA",
      "status": "new",
      "alert_status": "moderate",
      "notes": "..."
    },
    {
      "id": 11,
      "subindicator_name": "Voltaje de Fase B (Ub)",
      "origin": "Subtensión - Fase B",
      "..."
    }
  ]
}
```

> `today_count` uses the project's `TIME_ZONE` (not UTC) to determine the current date.

### Examples

```bash
# Latest undervoltage alert per phase for measurement point 2
curl "http://localhost:8000/api/v1/alerts/energy/voltage-fluctuation/latest-by-phase/?measurement_point=2&fluctuation_subtype=undervoltage" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

```javascript
// Load summary table when user selects a tab (e.g. "Subtensión")
const res = await fetch(
  `/api/v1/alerts/energy/voltage-fluctuation/latest-by-phase/?measurement_point=${mpId}&fluctuation_subtype=undervoltage`,
  { headers: { Authorization: `Bearer ${token}` } }
);
const rows = await res.json(); // array of up to 6 items, one per phase
```

---

## 3. Alert Reading Detail — `GET /api/v1/alerts/<alert_id>/voltage-fluctuation/readings/`

Returns all readings for the day the alert occurred. No backend pagination — the frontend
paginates the table and uses the full list to render the voltage chart.
The triggering reading is marked with `is_alert_reading: true`.

### Path Parameters

| Parameter  | Type    | Description  |
|------------|---------|--------------|
| `alert_id` | integer | Alert ID     |

### Response

```json
{
  "alert_id": 42,
  "alert_reading_id": 1001,
  "date": "2026-03-05",
  "measurement_point_id": 2,
  "measurement_point_name": "Llave general TGA",
  "phase_type": "A",
  "fluctuation_subtype": "undervoltage",
  "threshold_high": 231.0,
  "threshold_low": 207.0,
  "readings": [
    {
      "id": 1001,
      "date": "Jueves, 5 de Marzo",
      "time": "08:00",
      "Ua_value": 195.3,
      "Ub_value": 220.1,
      "Uc_value": 218.7,
      "Uab_value": 382.0,
      "Ubc_value": 380.5,
      "Uac_value": 381.2,
      "P_value": 12500.0,
      "is_alert_reading": true
    }
  ]
}
```

| Field              | Type            | Description                                             |
|--------------------|-----------------|---------------------------------------------------------|
| `alert_id`         | int             | ID of the alert                                         |
| `alert_reading_id` | int             | ID of the reading that triggered the alert              |
| `date`             | YYYY-MM-DD      | Date of the alert (local timezone)                      |
| `threshold_high`   | float \| null   | Upper voltage limit for the chart reference line        |
| `threshold_low`    | float \| null   | Lower voltage limit for the chart reference line        |
| `readings`         | array           | All readings for that day, ordered newest first         |
| `is_alert_reading` | bool            | `true` only for the reading that triggered the alert    |

> Thresholds are derived from the `EnergyThresholdProfile` linked to the measurement point
> (or its headquarter/enterprise fallback). `threshold_high = nominal × high_ratio`,
> `threshold_low = nominal × low_ratio`.

### Example

```bash
curl "http://localhost:8000/api/v1/alerts/energy/voltage-fluctuation/42/detail/" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

```javascript
const res = await fetch(`/api/v1/alerts/energy/voltage-fluctuation/${alertId}/detail/`, {
  headers: { Authorization: `Bearer ${token}` },
});
const data = await res.json();
// data.threshold_high / data.threshold_low → chart reference lines
// data.readings → full day, find is_alert_reading: true to scroll to it
// Frontend is responsible for paginating the readings table
```

---

## Phase Mapping

| `phase_type` | Reading field | `subindicator_name` |
|---|---|---|
| `A` | `Ua_value` | Voltaje de Fase A (Ua) |
| `B` | `Ub_value` | Voltaje de Fase B (Ub) |
| `C` | `Uc_value` | Voltaje de Fase C (Uc) |
| `AB` | `Uab_value` | Voltaje entre Fase A y B (Uab) |
| `BC` | `Ubc_value` | Voltaje entre Fase B y C (Ubc) |
| `AC` | `Uac_value` | Voltaje entre Fase A y C (Uac) |

---

## Migrations

```bash
DJANGO_SETTINGS_MODULE=config.settings.development python manage.py migrate alerts
```

- `0015_add_zero_voltage_subtype` — adds `zero_voltage` fluctuation subtype
- `0016_alert_status_to_english` — updates `alert_status` values to `moderate`/`critical`
