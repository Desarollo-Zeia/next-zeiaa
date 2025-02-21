
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
  PPM: 'ppm' ,
  MG_M3: 'mg/m³' ,
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
  CRITICAL: 'Peligroso'
}

export const STATUS_COLOR = {
  MODERATE: 'text-yellow-500',
  UNHEALTHY: 'text-orange-500',
  DANGEROUS: 'text-red-500',
  GOOD: 'text-green-500',
  CRITICAL: 'text-red-500'
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
  Ua: { parameter: "Voltaje de fase A", unit: "V" },
  Ub: { parameter: "Voltaje de fase B", unit: "V" },
  Uc: { parameter: "Voltaje de fase C", unit: "V" },
  Uab: { parameter: "Voltaje entre AB", unit: "V" },
  Ubc: { parameter: "Voltaje entre BC", unit: "V" },
  Uac: { parameter: "Voltaje entre AC", unit: "V" },
  Ia: { parameter: "Corriente de la fase A", unit: "A" },
  Ib: { parameter: "Corriente de la fase B", unit: "A" },
  Ic: { parameter: "Corriente de la fase C", unit: "A" },
  In: { parameter: "Vector suma de las  fases", unit: "A" },
  Pa: { parameter: "Potencia activa de la fase A", unit: "KW" },
  Pb: { parameter: "Potencia activa de la fase B", unit: "KW" },
  Pc: { parameter: "Potencia activa de la fase C", unit: "KW" },
  P: { parameter: "Potencia activa total", unit: "KW" },
  Qa: { parameter: "Potencia reactiva de la fase A", unit: "KVar" },
  Qb: { parameter: "Potencia reactiva de la fase B", unit: "KVar" },
  Qc: { parameter: "Potencia reactiva de la fase C", unit: "KVar" },
  Q: { parameter: "Potencia reactiva total", unit: "KVar" },
  Sa: { parameter: "Potencia aparente de la fase A", unit: "KVA" },
  Sb: { parameter: "Potencia aparente de la fase B", unit: "KVA" },
  Sc: { parameter: "Potencia aparente de la fase C", unit: "KVA" },
  S: { parameter: "Potencia aparente total", unit: "KVA" },
  PFa: { parameter: "Factor de potencia de la fase A", unit: "-" },
  PFb: { parameter: "Factor de potencia de la fase B", unit: "-" },
  PFc: { parameter: "Factor de potencia de la fase C", unit: "-" },
  PF: { parameter: "Factor de potencia total", unit: "-" },
  F: { parameter: "Frecuencia", unit: "Hz" },
  Et: { parameter: "Consumo total de energía", unit: "KWh" },
  EPtA: { parameter: "Consumo total de energía en la fase A", unit: "KWh" },
  EPtB: { parameter: "Consumo total de energía en la fase B", unit: "KWh" },
  EPtC: { parameter: "Consumo total de energía en la fase C", unit: "KWh" },
  THDUa: {
    parameter: "Distorsión armónica total en voltaje de la fase A",
    unit: "%",
  },
  THDUb: {
    parameter: "Distorsión armónica total en voltaje de la fase B",
    unit: "%",
  },
  THDUc: {
    parameter: "Distorsión armónica total en voltaje de la fase C",
    unit: "%",
  },
  THDIa: {
    parameter: "Distorsión armónica total en corriente de la fase A",
    unit: "%",
  },
  THDIb: {
    parameter: "Distorsión armónica total en corriente de la fase B",
    unit: "%",
  },
  THDIc: {
    parameter: "Distorsión armónica total en corriente de la fase C",
    unit: "%",
  },
  EPpos: { parameter: "Consumo de energía activa hacia adelante", unit: "KWh" },
  EPneg: { parameter: "Consumo de energía activa hacia atras", unit: "KWh" },
  EQpos: {
    parameter: "Consumo de energía reactiva hacia adelante",
    unit: "KVarh",
  },
  EQneg: { parameter: "Consumo de energía reactiva hacia atras", unit: "KVarh" },
  EPposA: {
    parameter: "Consumo de energía activa hacia adelante en la fase A",
    unit: "KWh",
  },
  EPnegA: {
    parameter: "Consumo de energía activa hacia atras en la fase A",
    unit: "KWh",
  },
  EQposA: {
    parameter: "Consumo de energía reactiva hacia adelante en la fase A",
    unit: "KVarh",
  },
  EQnegA: {
    parameter: "Consumo de energía reactiva hacia atras en la fase A",
    unit: "KVarh",
  },
  EPposB: {
    parameter: "Consumo de energía activa hacia adelante en la fase B",
    unit: "KWh",
  },
  EPnegB: {
    parameter: "Consumo de energía activa hacia atras en la fase B",
    unit: "KWh",
  },
  EQposB: {
    parameter: "Consumo de energía reactiva hacia adelante en la fase B",
    unit: "KVarh",
  },
  EQnegB: {
    parameter: "Consumo de energía reactiva hacia atras en la fase B",
    unit: "KVarh",
  },
  EPposC: {
    parameter: "Consumo de energía activa hacia adelante en la fase C",
    unit: "KWh",
  },
  EPnegC: {
    parameter: "Consumo de energía activa hacia atras en la fase C",
    unit: "KWh",
  },
  EQposC: {
    parameter: "Consumo de energía reactiva hacia adelante en la fase C",
    unit: "KVarh",
  },
  EQnegC: {
    parameter: "Consumo de energía reactiva hacia atras en la fase C",
    unit: "KVarh",
  },
  VfunA: { parameter: "Voltaje fundamental en la fase A", unit: "V" },
  VfunB: { parameter: "Voltaje fundamental en la fase B", unit: "V" },
  VfunC: { parameter: "Voltaje fundamental en la fase C", unit: "V" },
  IfunA: { parameter: "Corriente fundamental en la fase A", unit: "A" },
  IfunB: { parameter: "Corriente fundamental en la fase B", unit: "A" },
  IfunC: { parameter: "Corriente fundamental en la fase C", unit: "A" },
  V3A: { parameter: "Tercer armonico en voltaje de la fase A", unit: "%" },
  V5A: { parameter: "Quinto armonico en voltaje de la fase A", unit: "%" },
  V7A: { parameter: "Septimo armonico en voltaje de la fase A", unit: "%" },
  V9A: { parameter: "Noveno armonico en voltaje de la fase A", unit: "%" },
  V11A: { parameter: "Undecimo armonico en voltaje de la fase A", unit: "%" },
  V3B: { parameter: "Tercer armonico en voltaje de la fase B", unit: "%" },
  V5B: { parameter: "Quinto armonico en voltaje de la fase B", unit: "%" },
  V7B: { parameter: "Septimo armonico en voltaje de la fase B", unit: "%" },
  V9B: { parameter: "Noveno armonico en voltaje de la fase B", unit: "%" },
  V11B: { parameter: "Undecimo armonico en voltaje de la fase B", unit: "%" },
  V3C: { parameter: "Tercer armonico en voltaje de la fase C", unit: "%" },
  V5C: { parameter: "Quinto armonico en voltaje de la fase C", unit: "%" },
  V7C: { parameter: "Septimo armonico en voltaje de la fase C", unit: "%" },
  V9C: { parameter: "Noveno armonico en voltaje de la fase C", unit: "%" },
  V11C: { parameter: "Undecimo armonico en voltaje de la fase C", unit: "%" },
};


export type Indicator = keyof typeof INDICATOR_UNIT_RAW;
export type Unit = keyof typeof UNIT_CONVERTED
export type Status = keyof typeof STATUS_TO_SPANISH