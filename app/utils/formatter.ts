
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

export type Indicator = keyof typeof INDICATOR_UNIT_RAW;
export type Unit = keyof typeof UNIT_CONVERTED
export type Status = keyof typeof STATUS_TO_SPANISH