import { getCompanyData } from "@/app/lib/auth"
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data"
import { consumptionCalculator, consumptionGraph, consumptionInvoice, consumptionTable } from "@/app/sevices/energy/tarifario/data"
import { SearchParams } from "@/app/type"
import { DateRangePicker } from "@/app/ui/energia/filters/datepicker-energy-filter"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
import ConsumptionTable from "@/app/ui/energia/tarifario/consumption-table"
import HistoricalCosumption from "@/app/ui/energia/tarifario/historical-consumption"
import OptionBar from "@/app/ui/energia/tarifario/option-bar"
import TariffTable from "@/app/ui/energia/tarifario/tariff-table"
import FiltersContainer from "@/app/ui/filters/filters-container"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"

function formatDate(dateString: string) {
  const originalDate = new Date(dateString);

  // Subtract 7 months
  originalDate.setMonth(originalDate.getMonth());

  // Subtract 1 year
  originalDate.setFullYear(originalDate.getFullYear());

  const day = originalDate.getDate().toString().padStart(2, '0');
  const month = originalDate.toLocaleString('default', { month: 'short' });
  const year = originalDate.getFullYear();

  return `${day} ${month} ${year}`;
}

export default async function Page({ searchParams }: SearchParams) {

  const { companies } = await getCompanyData()
  
    const { headquarter = '1' , panel = '1',  date_after = format(new Date(), 'yyyy-MM-dd'), date_before = format(new Date(), 'yyyy-MM-dd'), group_by = 'day', type = 'consumption', page = '1', selected = 'Resumen de consumos'} = await searchParams

    const energyDetails = await getEnergyCompanyDetails({ headquarterId: companies[0].id })

    const consumptionGraphReadings = await consumptionGraph({ panelId: panel, headquarterId: headquarter, date_after, date_before, group_by})
    const consumptionTableReadings = await consumptionTable({ panelId: panel, headquarterId: headquarter, date_after, date_before, page})

    const cosumptionCalculatorReadings = await consumptionCalculator({ panelId: panel, headquarterId: headquarter, date_after, date_before})
    const consumptionInvoiceReadings = await consumptionInvoice({ panelId: panel, headquarterId: headquarter})


  return (
    <div className="w-full">
      <FiltersContainer>
          <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
          <PanelsFilterEnergy energyPanels={  energyDetails.energy_headquarters[0].electrical_panels} />
          <DateRangePicker/>
      </FiltersContainer>
      <div className="w-full flex flex-col gap-24 px-6">
        <div className="w-full flex gap-2">
          <Card className="p-4 flex flex-col gap-2 shadow-md">
            <h3 className="font-semibold">Calculadora de consumos</h3>
            <div className="flex gap-4">
              <div>
                <p className='text-sm font-medium'>Consumo total de energía</p>
                <p className="text-4xl font-semibold">{cosumptionCalculatorReadings.consumption.toFixed(2)} kWH</p>
              </div>
              <div>
                <p className='text-sm font-medium'>Consumo total soles</p>
                <p className="text-4xl font-semibold">S/ {cosumptionCalculatorReadings.cost}</p>
              </div>
            </div>
          </Card>
          <Card className="flex-1 p-4 flex flex-col gap-2 shadow-md">
            <h3 className="font-semibold">Consumo del ciclo de facturación actual</h3>
            <div className="w-full grid grid-cols-5 grid-rows-2 gap-2">
              <div className="col-span-2 shadow-sm  rounded-lg p-2">
                <h4 className='text-sm font-medium'>Consumo total energía</h4>
                <p className='text-xs'>{consumptionInvoiceReadings.total_consumption} kWH</p>
              </div>
              <div className="shadow-sm  rounded-lg p-2">
                <h4 className='text-sm font-medium'>Consumo total soles</h4>
                <p className='text-xs'>S/ {consumptionInvoiceReadings.cost}</p>
              </div>
              <div className="shadow-sm  rounded-lg p-2">
                <h4 className='text-sm font-medium'>N° de Suministro</h4>
                <p className='text-xs'>{consumptionInvoiceReadings.supply_number}</p>
              </div>
              <div className="shadow-sm  rounded-lg p-2">
                <h4 className='text-sm font-medium'>Empresa concesionario</h4>
                <p className='text-xs'>{consumptionInvoiceReadings.energy_provider}</p>
              </div>

              <div className="shadow-sm  rounded-lg p-2">
                <h4 className='text-sm font-medium'>Potencia contratado</h4>
                <p className='text-xs'>{consumptionInvoiceReadings.power_contracted} kWh</p>
              </div>
              <div className="shadow-sm  rounded-lg p-2">
                <h4 className='text-sm font-medium'>Tipo</h4>
                <p className='text-xs'>{consumptionInvoiceReadings.electrical_panel_type}</p>
              </div>
              <div className="shadow-sm  rounded-lg p-2">
                <h4 className='text-sm font-medium'>Días facturados</h4>
                {/* <p className='text-xs'>{consumptionInvoiceReadings.billing_cycle_start} de {consumptionInvoiceReadings.billing_cycle_end} días</p> */}
                <p className='text-xs'>28 de 28 días</p>
              </div>
              <div className="col-span-2 shadow-sm rounded-lg p-2">
                <h4 className='text-sm font-medium'>Ciclo de facturación</h4>
                <p className='text-xs'>{formatDate(consumptionInvoiceReadings.billing_cycle_start)} - {formatDate(consumptionInvoiceReadings.billing_cycle_end)}</p>
              </div>
            </div>
          </Card>
        </div>
        <div className="w-full relative">
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
                <TariffTable/>
              )
            }
            
          </div>
          <div className="absolute rounded-t-lg overflow-hidden bg-slate-100 -top-[56px] flex">
            <OptionBar/>
          </div>
        </div>
      </div>
    </div>
  )
}
