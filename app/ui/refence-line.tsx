import { ReferenceLine } from 'recharts';

const ThresholdLines = ({ thresholds } : { thresholds: number[] | undefined}) => {
  if (!thresholds || thresholds.length < 1 || thresholds.length > 3) return null;

  // Determinar colores según la cantidad de thresholds
  const getStrokeColor = (index: number) => {
    switch(thresholds.length) {
      case 1: return '#ff0000'; // Rojo único para umbral simple
      case 2: return index === 0 ? '#ffd700' : '#ff0000'; // Amarillo/Rojo
      case 3: return ['#ffd700', '#ffa500', '#ff0000'][index]; // Amarillo/Naranja/Rojo
      default: return '#000';
    }
  };

  return thresholds.map((umbral: number, index: number) => (
    <ReferenceLine
      key={index}
      y={umbral}
      stroke={getStrokeColor(index)}
      strokeWidth={2}
      strokeDasharray="3 3"
      isFront={true}
    //   label={{
    //     value: getLabel(index),
    //     fill: getStrokeColor(index),
    //     position: 'insideTopRight',
    //     fontSize: 12
    //   }}
    />
  ))
}

export default ThresholdLines