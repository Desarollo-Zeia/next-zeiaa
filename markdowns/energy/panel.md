# Panel de Energía

## 1. Gráfico de Porcentajes de Energía

### Descripción
Este sección muestra un gráfico circular indicando el porcentaje de consumo de energía por cada punto de monitoreo respecto al consumo total de la llave general.

### Deseos
- Poder seleccionar un rango de fechas para calcular los porcentajes

### Notas Técnicas
- Cálculo: X = Consumo KWH de un punto de monitoreo / Total de consumo de la llave general
- Unidad de medida: Epos positivo (p) KWH
- Los porcentajes son derivados de la llave general (punto de monitoreo principal que proporciona energía al resto)

---

## 2. Tabla de Puntos de Medición

### Descripción
Una tabla que lista los diversos puntos de medición dentro de la empresa, junto con sus ubicaciones.

### Deseos
- Poder filtrar los puntos por sala/ubicación

### Notas Técnicas
- Datos requeridos por punto: ID, nombre, ubicación, consumo actual

---

## 3. Gráfico Mensual de Energía

### Descripción
Este gráfico muestra el consumo de energía a lo largo del mes.

### Deseos
- Poder seleccionar un rango de fechas a visualizar
- Tener un botón toggle para mostrar solo días laborables (lunes-viernes), excluyendo sábados y domingos
- Mostrar una línea de umbral que represente el límite de consumo recurrente

### Notas Técnicas
- El umbral de consumo recurrente es obligatorio pero su valor todavía no está registrado en el sistema
- El rango de fechas aplica tanto para este gráfico como para el gráfico de porcentajes
