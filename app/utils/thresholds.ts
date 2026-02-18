/**
 * Helper para obtener thresholds segun el dia de la semana
 */

interface DayValues {
  inferior: number
  superior: number
}

export interface VoltageByDay {
  workdays: DayValues
  saturday: DayValues
  sunday: DayValues
}

type ThresholdType = 'inferior' | 'superior'

/**
 * Obtiene el threshold correspondiente segun el dia de la semana
 * @param thresholds - Objeto con thresholds por dia
 * @param weekday - Dias de la semana ('1,2,3,4,5' = laborales, '6' = sabado, '7' = domingo)
 * @param type - Tipo de threshold ('inferior' o 'superior')
 */
export function getThresholdByWeekday(
  thresholds: VoltageByDay | undefined,
  weekday: string,
  type: ThresholdType
): number | undefined {
  if (!thresholds) return undefined

  if (weekday === '1,2,3,4,5') {
    return thresholds.workdays[type]
  }
  if (weekday === '6') {
    return thresholds.saturday[type]
  }
  return thresholds.sunday[type]
}

/**
 * Obtiene ambos thresholds (inferior y superior) para un dia
 */
export function getThresholdsByWeekday(
  thresholds: VoltageByDay | undefined,
  weekday: string
): { inferior?: number; superior?: number } {
  return {
    inferior: getThresholdByWeekday(thresholds, weekday, 'inferior'),
    superior: getThresholdByWeekday(thresholds, weekday, 'superior'),
  }
}
