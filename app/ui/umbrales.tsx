import { Unit } from '../type';
import { STATUS_COLOR, STATUS_TO_SPANISH, UNIT_CONVERTED } from '../utils/formatter';
import { DangerousFace, GoodFace, ModerateFace, UnhealthyFace } from './faces';

type Level = 'DANGEROUS' | 'UNHEALTHY' | 'MODERATE' | 'GOOD' | 'CRITICAL'


const STATUS_FACES = {
  GOOD: <GoodFace width={15} height={15} />,
  MODERATE: <ModerateFace width={15} height={15} />,
  UNHEALTHY: <UnhealthyFace width={15} height={15} />,
  DANGEROUS: <DangerousFace width={15} height={15} />,
  CRITICAL: <DangerousFace width={15} height={15} />,

}

type Thresholds = {
  level: Level,
  value: number
}

const IndicatorThreshold = ({ thresholds, unit }: { thresholds: Thresholds[], unit: string }) => {




  return (
    <div className="space-y-4">
      {thresholds.map((threshold, index) => (
        <div key={index} className={`flex items-center space-x-4 p-2 rounded-lg bg-gray-100`}>
          <div className={`${STATUS_COLOR[threshold.level]}`}>{STATUS_FACES[threshold.level]}</div>
          <div>
            <p className="font-semibold">{STATUS_TO_SPANISH[threshold.level]}</p>
            <p className="text-sm text-gray-600"> {'>'} {threshold.value} {UNIT_CONVERTED[unit as Unit]}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default IndicatorThreshold;