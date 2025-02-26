// Función auxiliar para generar datos de ejemplo
function generateMockData(count: number) {
  const baseDate = new Date("2025-02-21T16:59:15.329353-05:00")
  const results = []

  for (let i = 0; i < count; i++) {
    const date = new Date(baseDate)
    date.setMinutes(date.getMinutes() - i)

    results.push({
      created_at: date.toISOString(),
      device: {
        id: 1,
        name: "Device 1",
        model: "ADW 300",
        dev_eui: "24e124468d440660",
        phase_type: "three_phase",
        is_multichannel: true,
        number_of_channels: 2,
      },
      indicators: [
        {
          id: 9698 - i,
          values_per_channel: [
            {
              values: {
                P: 250 + Math.random() * 100,
                Q: -200 + Math.random() * 400,
                Ia: 1.5 + Math.random(),
                Ib: 1.5 + Math.random(),
                Ic: Math.random(),
                In: Math.random(),
                Ua: 220 + Math.random() * 10,
                Ub: Math.random() * 10,
                Uc: 225 + Math.random() * 10,
                Uab: 220 + Math.random() * 10,
                Uac: 225 + Math.random() * 5,
                Ubc: 225 + Math.random() * 5,
                EPneg: 1.85 + i * 0.01,
                EPpos: 4.3 + i * 0.02,
                EQneg: 3.53 + i * 0.01,
                EQpos: 7.15 + i * 0.02,
              },
              channel: 1,
            },
          ],
          measurement_point_name: "Unidad 1",
        },
      ],
    })
  }

  return {
    count: count,
    next: null,
    previous: null,
    results,
  }
}

export const mockData = generateMockData(30) // Generamos 30 registros

