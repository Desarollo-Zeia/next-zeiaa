import { getCompanyData } from "@/app/lib/auth"
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data"
import { consumptionCalculator, consumptionInvoice } from "@/app/sevices/energy/tarifario/data"
import { SearchParams } from "@/app/type"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
// import ConsumptionTable from "@/app/ui/energia/tarifario/consumption-table"
// import HistoricalCosumption from "@/app/ui/energia/tarifario/historical-consumption"
// import OptionBar from "@/app/ui/energia/tarifario/option-bar"
// import TariffTable from "@/app/ui/energia/tarifario/tariff-table"
import { DatepickerRange } from "@/app/ui/filters/datepicker-range"
import FiltersContainer from "@/app/ui/filters/filters-container"
import { Card } from "@/components/ui/card"
import { format } from "date-fns";
import { BadgeAlert } from "lucide-react"


export default async function Page({ searchParams }: SearchParams) {

  const { companies } = await getCompanyData()
  
  const { headquarter = '1' , panel = '1',  date_after = new Date(), date_before = new Date()} = await searchParams

const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  // 4. Paralelizar todas las peticiones dependientes
  const [
    energyDetails,
    // consumptionGraphReadings,
    // consumptionTableReadings,
    consumptionCalculatorReadings,
    consumptionInvoiceReadings,
    // consumptionTariffReadings
  ] = await Promise.all([
    getEnergyCompanyDetails({ headquarterId: companies[0].id }),
    // consumptionGraph({
    //   panelId: panel,
    //   headquarterId: headquarter,
    //   date_after: formattedDateAfter,
    //   date_before: formattedDateBefore,
    //   group_by
    // }),
    // consumptionTable({
    //   panelId: panel,
    //   headquarterId: headquarter,
    //   date_after: formattedDateAfter,
    //   date_before: formattedDateBefore,
    //   page
    // }),
    consumptionCalculator({
      panelId: panel,
      headquarterId: headquarter,
      date_after: formattedDateAfter,
      date_before: formattedDateBefore
    }),
    consumptionInvoice({
      panelId: panel,
      headquarterId: headquarter
    }),
    // consumptionTariff({
    //   panelId: panel,
    //   headquarterId: headquarter
    // })
  ])

  // const { totalDays, daysPassed, daysRemaining } = billingCycleInfo(consumptionInvoiceReadings?.billing_cycle_start, consumptionInvoiceReadings?.billing_cycle_end, new Date())

  return (
    <div className="w-full">
      <FiltersContainer>
          <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
          <PanelsFilterEnergy energyPanels={  energyDetails.energy_headquarters?.[0].electrical_panels} />
          <DatepickerRange />
      </FiltersContainer>
      <div className="w-full flex flex-col gap-24 px-6">
        <div className="w-full flex gap-2">
          <Card className="p-4 flex flex-col gap-2 shadow-md">
            <h3 className="font-semibold">Calculadora de consumos</h3>
            <div className="flex gap-4">
              <div>
                <p className='text-sm font-medium'>Consumo total de energía</p>
                { consumptionCalculatorReadings?.consumption ? <p className="text-4xl font-semibold mt-4">S/ {consumptionCalculatorReadings?.consumption?.toFixed(2)}</p> : <p className="mt-4 font-bold flex flex-col items-center"> Intente otras fechas
                  <BadgeAlert />
                  </p>}
              </div>
              <div>
                <p className='text-sm font-medium'>Consumo total soles</p>
                 { consumptionCalculatorReadings?.consumption ? <p className="text-4xl font-semibold mt-4">S/ {consumptionCalculatorReadings?.cost}</p> : <p className="mt-4 font-bold flex flex-col items-center"> Intente otras fechas
                  <BadgeAlert className="text-center"/>
                  </p>}
              </div>
            </div>
          </Card>
          <Card className="flex-1 p-4 flex flex-col gap-2 shadow-md">
            <h3 className="font-semibold">Consumo del ciclo de facturación actual</h3>
            <div className="w-full grid grid-cols-5 grid-rows-2 gap-2">
              <div className="col-span-2 shadow-sm  rounded-lg p-2">
                <h4 className='text-sm font-medium'>Consumo total energía</h4>
                <p className='text-xs'>{consumptionInvoiceReadings?.total_consumption.toFixed(2)} kWH</p>
              </div>
              <div className="shadow-sm  rounded-lg p-2">
                <h4 className='text-sm font-medium'>Consumo total soles</h4>
                <p className='text-xs'>S/ {consumptionInvoiceReadings?.cost}</p>
              </div>
              <div className="shadow-sm  rounded-lg p-2">
                <h4 className='text-sm font-medium'>N° de Suministro</h4>
                <p className='text-xs'>{consumptionInvoiceReadings?.supply_number}</p>
              </div>
              <div className="shadow-sm  rounded-lg p-2">
                <h4 className='text-sm font-medium'>Empresa concesionario</h4>
                <p className='text-xs'>{consumptionInvoiceReadings?.energy_provider}</p>
              </div>

              <div className="shadow-sm  rounded-lg p-2">
                <h4 className='text-sm font-medium'>Potencia contratado</h4>
                <p className='text-xs'>{consumptionInvoiceReadings?.power_contracted} kWh</p>
              </div>
              <div className="shadow-sm  rounded-lg p-2">
                <h4 className='text-sm font-medium'>Tipo</h4>
                <p className='text-xs'>{consumptionInvoiceReadings?.electrical_panel_type}</p>
              </div>
              <div className="shadow-sm  rounded-lg p-2">
                <h4 className='text-sm font-medium'>Días facturados</h4>
                <p className='text-xs'>29 de 29 </p>
              </div>
              <div className="col-span-2 shadow-sm rounded-lg p-2">
                <h4 className='text-sm font-medium'>Ciclo de facturación</h4>
                <p className='text-xs'>{consumptionInvoiceReadings?.billing_cycle_start} - {consumptionInvoiceReadings?.billing_cycle_end}</p>
              </div>
            </div>
          </Card>
        </div>
        {/* <div className="w-full relative">
          <div className="p-4 w-full">
            {
              selected === 'Resumen de consumos' && (
                <ConsumptionTable consumptionTableReadings={consumptionTableReadings}/> 
              )
            } 
            {
              selected === 'Historial de consumo' && (
                <HistoricalCosumption type={type} group_by={group_by} consumptionGraphReadings={consumptionGraphReadings}/>
              )
            }
            {
              selected === 'Tarifario' && (
                <TariffTable tariffData={consumptionTariffReadings}/>
              )
            }
            
          </div>
          <div className="absolute rounded-t-lg overflow-hidden bg-slate-100 -top-[56px] flex">
            <OptionBar/>
          </div>
        </div> */}
      </div>
    </div>
  )
}
