// import { getCompanyData } from '@/app/lib/auth'
import { getToken } from '@/app/lib/auth'
import { armonicsGraph } from '@/app/sevices/energy/distorsion/data'
import { getHeadquarters } from '@/app/sevices/energy/enterprise/data'
import { SearchParams } from '@/app/type'
// import CurrentChart from '@/app/ui/energia/distorsion/current-chart'
import CurrentChartTest from '@/app/ui/energia/distorsion/current-chart-test'
import CurrentVoltageToggle from '@/app/ui/energia/distorsion/current-voltage-toggle'
import IndicatorsModal from '@/app/ui/energia/distorsion/indicators-modal'
import VoltageChartTest from '@/app/ui/energia/distorsion/voltage-chart-test'
// import VoltageChart from '@/app/ui/energia/distorsion/voltage-current'
import HeadquarterEnergyFilter from '@/app/ui/energia/filters/headquarter-energy-filter'
// import PanelsFilterEnergy from '@/app/ui/energia/filters/panels-energy-filter'
import { DatepickerRange } from '@/app/ui/filters/datepicker-range'
import FiltersContainer from '@/app/ui/filters/filters-container'
import NoResultFound from '@/app/ui/no-result-found'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

async function DistorsionContent({ searchParams }: SearchParams) {

  const { headquarter, panel = '1', date_after = new Date(), date_before = new Date(), data_type = 'current' } = await searchParams

  const authToken = await getToken()


  const headquarters = await getHeadquarters(authToken!)
  const { results } = headquarters
  const firstHeadquarter = headquarter || results[0].id.toString()

  const armonicsGraphReadings = await armonicsGraph({ headquarterId: firstHeadquarter, panelId: panel, date_after: format(date_after, 'yyyy-MM-dd'), date_before: format(date_before, 'yyyy-MM-dd'), data_type })

  return (
    <div className='w-full'>
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter} />
        {/* <PanelsFilterEnergy energyPanels={  energyDetails.energy_headquarters[0].electrical_panels} /> */}
        <DatepickerRange />
      </FiltersContainer>
      <div className="mx-6">
        <CurrentVoltageToggle type={data_type}>
          <Link href={"/energia/dashboard/distorsion/detail"}>
            <Button variant="secondary" size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              Ver detalles
            </Button>
          </Link>
        </CurrentVoltageToggle>
        <div className='w-full mx-auto'>
          {
            armonicsGraphReadings?.length === 0 ? (
              <NoResultFound />
            ) : (
              data_type === 'current' ?
                (
                  <CurrentChartTest currentReadings={armonicsGraphReadings} />
                ) :
                (
                  <VoltageChartTest voltageReadings={armonicsGraphReadings} />
                )
            )
          }
        </div>
        {
          armonicsGraphReadings?.length === 0 ? (
            ''
          ) : (
            <div className='flex justify-start'>
              <div className='bg-white shadow-md p-4 flex flex-col gap-2'>
                <div className='flex justify-between gap-6 bg-slate-100 p-2 text-sm'>
                  <div className='flex items-center gap-2'>
                    <div className='h-4 w-4 bg-yellow-300 rounded-lg'></div>
                    <p>Límite de distorsión en voltaje THD</p>
                  </div>
                  <p>8%</p>
                </div>
                <div className='flex justify-between gap-6 bg-slate-100 p-2 text-sm'>
                  <div className='flex items-center gap-2'>
                    <div className='h-4 w-4 bg-red-500 rounded-lg'></div>
                    <p>Límite de distorsión en voltaje armónico</p>
                  </div>
                  <p>5%</p>
                </div>
                <IndicatorsModal />
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default async function page({ searchParams }: SearchParams) {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <DistorsionContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

