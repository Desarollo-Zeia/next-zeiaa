import { format } from "date-fns"

export const INDICATOR_CONVERTED = {
  CO2: 'CO2',
  HCHO: 'HCHO',
  PM10: 'PM10',
  PM2_5: 'PM2.5',
  HUMIDITY: 'Humedad',
  TEMPERATURE: 'Temperatura',
  TVOC: 'TVOC',
  PRESSURE: 'Presión'
}


export const INDICATOR_UNIT_RAW = {
  CO2: 'PPM',
  HCHO: 'MG_M3',
  PM10: 'UG_M3',
  PM2_5: 'UG_M3',
  HUMIDITY: 'PERCENT',
  TEMPERATURE: 'CELSIUS',
  TVOC: 'ICA',
  PPB: 'PPB'
}

export const UNIT_CONVERTED = {
  PPM: 'ppm',
  MG_M3: 'mg/m³',
  UG_M3: 'µg/m³',
  PERCENT: '%',
  CELSIUS: '°C',
  ICA: 'ica',
  PPB: 'ppb'
}

export const INDICATOR_UNIT_CONVERTED = {
  CO2: 'ppm',
  HCHO: 'mg/m³',
  PM10: 'µg/m³',
  PM2_5: 'µg/m³',
  HUMIDITY: '%',
  TEMPERATURE: '°C',
}

export const STATUS_TO_SPANISH = {
  MODERATE: 'Moderado',
  UNHEALTHY: 'Insalubre',
  DANGEROUS: 'Peligroso',
  GOOD: 'Bueno',
  CRITICAL: 'Crítico',
  HUMIDITY_MIN: 'Mínimo máximo permitido',
  HUMIDITY_MAX: 'Máximo permitido',
  TEMPERATURE_MIN: 'Mínimo máximo permitido',
  TEMPERATURE_MAX: 'Máximo permitido',
}

export const STATUS_COLOR = {
  MODERATE: 'text-yellow-500',
  UNHEALTHY: 'text-orange-500',
  DANGEROUS: 'text-red-500',
  GOOD: 'text-green-500',
  CRITICAL: 'text-red-500',
  HUMIDITY_MIN: 'Mínimo máximo permitido',
  HUMIDITY_MAX: 'Máximo permitido',
  TEMPERATURE_MIN: 'Mínimo máximo permitido',
  TEMPERATURE_MAX: 'Máximo permitido',
}

export const STATUS_COLOR_THRESHOLD = {
  MODERATE: 'yellow',
  UNHEALTHY: 'orange',
  DANGEROUS: 'red',
  GOOD: 'green',
  CRITICAL: 'red',
  HUMIDITY_MIN: 'green',
  HUMIDITY_MAX: 'red',
  TEMPERATURE_MIN: 'green',
  TEMPERATURE_MAX: 'red'
}

export const STATUS_COLOR_THRESHOLD_CHART = {
  MODERATE: '#FCD34D',    // yellow más suave
  UNHEALTHY: '#FB923C',   // orange
  DANGEROUS: '#EF4444',   // red
  GOOD: '#10B981',        // green
  CRITICAL: '#DC2626',     // red más oscuro
  HUMIDITY_MIN: '#10B981',
  HUMIDITY_MAX: '#DC2626',
  TEMPERATURE_MIN: '#10B981',
  TEMPERATURE_MAX: '#DC2626'
}

export const STATUS_COLOR_BG = {
  MODERATE: 'bg-yellow-500',
  UNHEALTHY: 'bg-orange-500',
  DANGEROUS: 'bg-red-500',
  GOOD: 'bg-green-500',
  CRITICAL: 'bg-red-500',
  HUMIDITY_MIN: 'bg-green-500',
  HUMIDITY_MAX: 'bg-red-500',
  TEMPERATURE_MIN: 'bg-green-500',
  TEMPERATURE_MAX: 'bg-red-500',
}


export const INDICATOR_MEASUREMENT_TEXT = {
  CO2: "El CO2 es el indicador de riesgo de contagio y transmisión de virus para el COVID-19, regulado por el Minsa en su anexo 10. El CO2 indica el grado de ventilación que tiene un espacio, se estima que el 1 % del aire que se respira ya fue respirado por otra persona, las personas exhalan CO2 por lo que la acumulación de este gas es un buen indicador de la acumulación de aerosoles que podrían transmitir la COVID-19.",
  HUMIDITY: "Mide la cantidad de vapor de agua que contiene el aire, necesaria para evaluar nuestra comodidad térmica. Cuanto más alto sea el porcentaje, más calor tendremos; y cuando es bajo, hace más frío. También afecta la salud cuando está por debajo del mínimo y por encima del máximo, es decir, cuando el aire está muy seco, sentimos incomodidad al respirar. Y el exceso de humedad acelera la proliferación de microorganismos, que causan alergias.",
  TEMPERATURE: "La temperatura es un indicador de la cantidad de calor que hay en el ambiente. La temperatura ideal para el ser humano es de 22 a 24 grados centígrados. Cuando la temperatura es muy baja, sentimos frío y cuando es muy alta, sentimos calor. La temperatura también afecta la salud, ya que cuando es muy baja, puede causar hipotermia y cuando es muy alta, puede causar golpes de calor.",
  PM10: "Las partículas PM10 son partículas suspendidas en el aire que tienen un diámetro menor a 10 micrómetros. Estas partículas pueden ser inhaladas y llegar a los pulmones, causando problemas respiratorios y cardiovasculares. Las fuentes de estas partículas son la quema de combustibles fósiles, la industria, la agricultura y el tráfico vehicular.",
  PM2_5: "Las partículas PM2.5 son partículas suspendidas en el aire que tienen un diámetro menor a 2.5 micrómetros. Estas partículas pueden ser inhaladas y llegar a los pulmones, causando problemas respiratorios y cardiovasculares. Las fuentes de estas partículas son la quema de combustibles fósiles, la industria, la agricultura y el tráfico vehicular.",
  TVOC: "Los compuestos orgánicos volátiles son sustancias volátiles que se evaporan ligeramente desde temperaturas bajas, es decir se 'volatilizan' en estado gaseoso, con lo cual contaminan el aire.",
  HCHO: "Es un producto químico que se utiliza en la creación de distintos productos desde ropa, plásticos, papel hasta productos de belleza y otros. También es usado como como bactericida o conservante. Es considerado altamente cancerígeno."
}

export const INDICATOR_CONSEQUENCES_TEXT = {
  CO2: ["Dolor de cabeza", "Fatiga", "Dificultad para concentrarse", "Disminución de la productividad", "Irritabilidad", "Dificultad para respirar"],
  HUMIDITY: ["Alergias", "Asma", "Bronquitis", "Resfriados", "Infecciones respiratorias", "Problemas de piel"],
  TEMPERATURE: ["Golpes de calor", "Desmayos", "Deshidratación", "Hipotermia", "Congelamiento", "Problemas circulatorios"],
  PM10: ["Problemas respiratorios", "Problemas cardiovasculares", "Problemas de salud en niños y ancianos", "Problemas de salud en personas con enfermedades respiratorias"],
  PM2_5: ["Problemas respiratorios", "Problemas cardiovasculares", "Problemas de salud en niños y ancianos", "Problemas de salud en personas con enfermedades respiratorias"],
  TVOC: ["Irritación de ojos, nariz y garganta", "Dolor de cabeza", "Fatiga", "Mareos", "Problemas respiratorios", "Problemas de memoria"],
  HCHO: ["Irritación de ojos, nariz y garganta", "Dolor de cabeza", "Fatiga", "Mareos", "Problemas respiratorios", "Problemas de memoria"]
}

export const ELECTRIC_PARAMETERS = {
  Ua: { parameter: "Voltaje de fase R", unit: "V" },
  Ub: { parameter: "Voltaje de fase S", unit: "V" },
  Uc: { parameter: "Voltaje de fase T", unit: "V" },
  Uab: { parameter: "Voltaje entre RS", unit: "V" },
  Ubc: { parameter: "Voltaje entre ST", unit: "V" },
  Uac: { parameter: "Voltaje entre RT", unit: "V" },

  Ia: { parameter: "Corriente de la fase R", unit: "A" },
  Ib: { parameter: "Corriente de la fase S", unit: "A" },
  Ic: { parameter: "Corriente de la fase T", unit: "A" },
  In: { parameter: "Vector suma de las  fases", unit: "A" },

  Pa: { parameter: "Potencia activa de la fase R", unit: "KW" },
  Pb: { parameter: "Potencia activa de la fase S", unit: "KW" },
  Pc: { parameter: "Potencia activa de la fase T", unit: "KW" },
  P: { parameter: "Potencia activa total", unit: "KW" },

  Qa: { parameter: "Potencia reactiva de la fase R", unit: "KVar" },
  Qb: { parameter: "Potencia reactiva de la fase S", unit: "KVar" },
  Qc: { parameter: "Potencia reactiva de la fase T", unit: "KVar" },
  Q: { parameter: "Potencia reactiva total", unit: "KVar" },
  Sa: { parameter: "Potencia aparente de la fase R", unit: "KVA" },
  Sb: { parameter: "Potencia aparente de la fase S", unit: "KVA" },
  Sc: { parameter: "Potencia aparente de la fase T", unit: "KVA" },
  S: { parameter: "Potencia aparente total", unit: "KVA" },
  PFa: { parameter: "Factor de potencia de la fase R", unit: "-" },
  PFb: { parameter: "Factor de potencia de la fase S", unit: "-" },
  PFc: { parameter: "Factor de potencia de la fase T", unit: "-" },
  PF: { parameter: "Factor de potencia total", unit: "-" },
  F: { parameter: "Frecuencia", unit: "Hz" },

  Et: { parameter: "Consumo total de energía", unit: "KWh" },
  EPtA: { parameter: "Consumo total de energía en la fase R", unit: "KWh" },
  EPtB: { parameter: "Consumo total de energía en la fase S", unit: "KWh" },
  EPtC: { parameter: "Consumo total de energía en la fase T", unit: "KWh" },

  THDUa: {
    parameter: "Distorsión armónica total en voltaje de la fase R",
    unit: "%",
  },
  THDUb: {
    parameter: "Distorsión armónica total en voltaje de la fase S",
    unit: "%",
  },
  THDUc: {
    parameter: "Distorsión armónica total en voltaje de la fase T",
    unit: "%",
  },

  THDIa: {
    parameter: "Distorsión armónica total en corriente de la fase R",
    unit: "%",
  },
  THDIb: {
    parameter: "Distorsión armónica total en corriente de la fase S",
    unit: "%",
  },
  THDIc: {
    parameter: "Distorsión armónica total en corriente de la fase T",
    unit: "%",
  },

  EPpos: { parameter: "Consumo de energía activa entregada", unit: "KWh" },
  EPneg: { parameter: "Consumo de energía activa recibida", unit: "KWh" },
  EQpos: {
    parameter: "Consumo de energía reactiva",
    unit: "KVarh",
  },
  EQneg: { parameter: "Consumo de energía reactiva", unit: "KVarh" },
  EPposA: {
    parameter: "Consumo de energía activa en la fase R",
    unit: "KWh",
  },
  EPnegA: {
    parameter: "Consumo de energía activa en la fase R",
    unit: "KWh",
  },
  EQposA: {
    parameter: "Consumo de energía reactiva en la fase R",
    unit: "KVarh",
  },
  EQnegA: {
    parameter: "Consumo de energía reactiva en la fase R",
    unit: "KVarh",
  },
  EPposB: {
    parameter: "Consumo de energía activa en la fase S",
    unit: "KWh",
  },
  EPnegB: {
    parameter: "Consumo de energía activa en la fase S",
    unit: "KWh",
  },
  EQposB: {
    parameter: "Consumo de energía reactiva en la fase S",
    unit: "KVarh",
  },
  EQnegB: {
    parameter: "Consumo de energía reactiva en la fase S",
    unit: "KVarh",
  },
  EPposC: {
    parameter: "Consumo de energía activa en la fase T",
    unit: "KWh",
  },
  EPnegC: {
    parameter: "Consumo de energía activa en la fase T",
    unit: "KWh",
  },
  EQposC: {
    parameter: "Consumo de energía reactiva en la fase T",
    unit: "KVarh",
  },
  EQnegC: {
    parameter: "Consumo de energía reactiva en la fase T",
    unit: "KVarh",
  },
  VfunA: { parameter: "Voltaje fundamental en la fase R", unit: "V" },
  VfunB: { parameter: "Voltaje fundamental en la fase S", unit: "V" },
  VfunC: { parameter: "Voltaje fundamental en la fase T", unit: "V" },
  IfunA: { parameter: "Corriente fundamental en la fase R", unit: "A" },
  IfunB: { parameter: "Corriente fundamental en la fase S", unit: "A" },
  IfunC: { parameter: "Corriente fundamental en la fase T", unit: "A" },
  V3A: { parameter: "Tercer armonico en voltaje de la fase R", unit: "%" },
  V5A: { parameter: "Quinto armonico en voltaje de la fase R", unit: "%" },
  V7A: { parameter: "Septimo armonico en voltaje de la fase R", unit: "%" },
  V9A: { parameter: "Noveno armonico en voltaje de la fase R", unit: "%" },
  V11A: { parameter: "Undecimo armonico en voltaje de la fase R", unit: "%" },
  V3B: { parameter: "Tercer armonico en voltaje de la fase S", unit: "%" },
  V5B: { parameter: "Quinto armonico en voltaje de la fase S", unit: "%" },
  V7B: { parameter: "Septimo armonico en voltaje de la fase S", unit: "%" },
  V9B: { parameter: "Noveno armonico en voltaje de la fase S", unit: "%" },
  V11B: { parameter: "Undecimo armonico en voltaje de la fase S", unit: "%" },
  V3C: { parameter: "Tercer armonico en voltaje de la fase T", unit: "%" },
  V5C: { parameter: "Quinto armonico en voltaje de la fase T", unit: "%" },
  V7C: { parameter: "Septimo armonico en voltaje de la fase T", unit: "%" },
  V9C: { parameter: "Noveno armonico en voltaje de la fase T", unit: "%" },
  V11C: { parameter: "Undecimo armonico en voltaje de la fase T", unit: "%" },
};

export const UNIT_NAMES = {
  V: "Voltaje",

  A: "Corriente",
  KW: "Potencia Activa",
  KVar: "Potencia Reactiva",
  KVA: "Potencia Aparente",

  KWh: "Energía Activa",
  KVarh: "Energía Reactiva",
  "%": "Distorsión Armónica",
  Hz: "Frecuencia",
  "-": "Factor de Potencia",
} as const

export const UNIT_ORDER = ["V", "A", "KW", "KVar", "KVA", "KWh", "KVarh", "%", "Hz", "-"] as const


export const START_DATE = format(new Date(), 'yyyy-MM-dd')

export type Indicator = keyof typeof INDICATOR_UNIT_RAW;
export type Unit = keyof typeof UNIT_CONVERTED
export type Status = keyof typeof STATUS_TO_SPANISH