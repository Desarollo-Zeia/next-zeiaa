import { Unit } from '../type';
import { UNIT_CONVERTED } from '../utils/formatter';
import { DangerousFace, GoodFace, ModerateFace, UnhealthyFace } from './faces';

const IndicatorThreshold = ({ thresholds, unit  } : { thresholds: number[] | undefined, unit: string}) => {
  // Validar que el array tenga entre 1-3 elementos
  if (!thresholds || thresholds.length < 1 || thresholds.length > 3) {
    return <div>Configuración de thresholds inválida</div>
  }

  // Determinar etiquetas y emojis según la cantidad de thresholds
  const getEtiquetasYEmojis = () => {
    const cantidad = thresholds.length;
    const emojis = {
      Bueno: <GoodFace width={24} height={24}/>,
      Moderado: <ModerateFace width={24} height={24}/>,
      Insalubre: <UnhealthyFace width={24} height={24}/>,
      Peligroso: <DangerousFace width={24} height={24}/>,
      Malo: <DangerousFace width={24} height={24}/>
    }

    if (cantidad === 1) {
      return [
        { label: 'Bueno', emoji: emojis.Bueno, color: "text-green-600" },
        { label: 'Malo', emoji: emojis.Malo, color: "text-red-600" }
      ];
    }
    if (cantidad === 2) {
      return [
        { label: 'Bueno', emoji: emojis.Bueno, color: "text-green-600"},
        { label: 'Moderado', emoji: emojis.Moderado, color: "text-yellow-600" },
        { label: 'Peligroso', emoji: emojis.Peligroso, color: "text-red-600" }
      ];
    }
    return [
      { label: 'Bueno', emoji: emojis.Bueno, color: "text-green-600" },
      { label: 'Moderado', emoji: emojis.Moderado, color: "text-yellow-600" },
      { label: 'Insalubre', emoji: emojis.Insalubre, color: "text-orange-600" },
      { label: 'Peligroso', emoji: emojis.Peligroso, color: "text-red-600" }
    ]
  }

  // Generar los rangos a mostrar
  const generarRangos = () => {
    const etiquetas = getEtiquetasYEmojis();
    const rangos = [];

    // Primer rango
    rangos.push({
      texto: `< ${thresholds[0]}`,
      ...etiquetas[0]
    })

    // Rangos intermedios
    for (let i = 0; i < thresholds.length - 1; i++) {
      rangos.push({
        texto: `${thresholds[i]} - ${thresholds[i + 1]}`,
        ...etiquetas[i + 1]
      })
    }

    // Último rango
    rangos.push({
      texto: `> ${thresholds[thresholds.length - 1]}`,
      ...etiquetas[etiquetas.length - 1]
    });

    return rangos;
  }

  const rangos = generarRangos()

  return (
    <div className="space-y-4">
      {rangos.map((rango, index) => (
          <div key={index} className={`flex items-center space-x-4 p-2 rounded-lg bg-gray-100`}>
              <div className={`${rango.color}`}>{rango.emoji}</div>
              <div>
                  <p className="font-semibold">{rango.label}</p>
                  <p className="text-sm text-gray-600">{rango.texto} {UNIT_CONVERTED[unit as Unit]}</p>
              </div>
          </div>
      ))}
    </div>
  )
}

export default IndicatorThreshold;