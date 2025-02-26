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
  // ... resto de los parámetros
} as const

