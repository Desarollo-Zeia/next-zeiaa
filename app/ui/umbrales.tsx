import { Unit } from '../type';
import { STATUS_COLOR, STATUS_TO_SPANISH, UNIT_CONVERTED } from '../utils/formatter';
import { DangerousFace, GoodFace, ModerateFace, UnhealthyFace } from './faces';

type Level = 'DANGEROUS' | 'UNHEALTHY' | 'MODERATE' | 'GOOD' | 'CRITICAL'


const STATUS_FACES = {
  GOOD: <GoodFace width={20} height={20} />,
  MODERATE: <ModerateFace width={20} height={20} />,
  UNHEALTHY: <UnhealthyFace width={20} height={20} />,
  DANGEROUS: <DangerousFace width={20} height={20} />,
  CRITICAL: <DangerousFace width={20} height={20} />,
  TEMP_MIN: <ModerateFace width={20} height={20} />,
  TEMP_MAX: <DangerousFace width={20} height={20} />,
  HUMIDITY_MIN: <ModerateFace width={20} height={20} />,
  HUMIDITY_MAX: <DangerousFace width={20} height={20} />,

}

type Thresholds = {
  level: Level,
  value: number
}

const IndicatorThreshold = ({ thresholds, unit }: { thresholds: Thresholds[], unit: string }) => {

  return (
    <div className="space-y-4">
      {
        thresholds?.length > 0 ? (
          thresholds?.map((threshold, index) => (
            <div key={index} className={`flex items-center space-x-4 p-2 rounded-lg bg-gray-100`}>
              <div className={`${STATUS_COLOR[threshold.level]}`}>{STATUS_FACES[threshold.level]}</div>
              <div>
                <p className="font-semibold">{STATUS_TO_SPANISH[threshold.level]}</p>
                <p className="text-sm text-gray-600"> {'>'} {threshold.value} {UNIT_CONVERTED[unit as Unit]}</p>
              </div>
            </div>
          ))
        ) : (
          <p className='text-center'>No se encuentraron umbrales</p>
        )
      }

    </div>
  )
}

export default IndicatorThreshold;