import { getCompanyData } from "@/app/lib/auth"
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data"
// import { consumptionGraph } from "@/app/sevices/energy/tarifario/data"
// import { SearchParams } from "@/app/type"
import { DateRangePicker } from "@/app/ui/energia/filters/datepicker-energy-filter"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
import OptionBar from "@/app/ui/energia/tarifario/option-bar"
import TarifarioChart from "@/app/ui/energia/tarifario/tarifario-chart"
import FiltersContainer from "@/app/ui/filters/filters-container"
import { Card } from "@/components/ui/card"
// import { format } from "date-fns"

export default async function Page() {

  const { companies } = await getCompanyData()
  
    // const { headquarter = '1' , panel = '1',  date_after = format(new Date(), 'yyyy-MM-dd'), date_before = format(new Date(), 'yyyy-MM-dd'), data_type = 'current'} = await searchParams
  
    const energyDetails = await getEnergyCompanyDetails({ headquarterId: companies[0].id })

    // const consumptionGraphReadings = await consumptionGraph({ panelId: panel, headquarterId: headquarter, date_after, date_before})

  return (
    <div className="w-full">
      <FiltersContainer>
          <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
          <PanelsFilterEnergy energyPanels={  energyDetails.energy_headquarters[0].electrical_panels} />
          <DateRangePicker/>
      </FiltersContainer>
      <div className="w-full flex flex-col gap-24 px-6">
        <div className="flex gap-2">
          <Card className="p-4">
            <h3>Calculadora de consumos</h3>
            <div className="flex gap-4">
              <div>
                <p className='text-sm'>Consumo total de energía</p>
                <p className="text-2xl font-semibold">10,024.21 kWH</p>
              </div>
              <div>
                <p className='text-sm'>Consumo total soles</p>
                <p className="text-2xl font-semibold">S/ 100</p>
              </div>
            </div>
          </Card>
          <Card className="flex-1 p-4">
            <h3>Consumo del ciclo de facturación actual</h3>
            <div className="grid grid-cols-5 grid-rows-2 gap-2">
              <div className="col-span-2">
                <h4 className='text-sm'>Consumo total energía</h4>
                <p className='text-xs'>20,624.21 kWH</p>
              </div>
              <div>
                <h4 className='text-sm'>Consumo total soles</h4>
                <p className='text-xs'>S/ 700</p>
              </div>
              <div>
                <h4 className='text-sm'>N° de Suministro</h4>
                <p className='text-xs'>059323532</p>
              </div>
              <div>
                <h4 className='text-sm'>Empresa concesionario</h4>
                <p className='text-xs'>Luz del Sur</p>
              </div>

              <div>
                <h4 className='text-sm'>Potencia contratado</h4>
                <p className='text-xs'>200kW</p>
              </div>
              <div>
                <h4 className='text-sm'>Tipo</h4>
                <p className='text-xs'>Trífasica</p>
              </div>
              <div>
                <h4 className='text-sm'>Días facturados</h4>
                <p className='text-xs'>14 de 30 días</p>
              </div>
              <div className="col-span-2">
                <h4 className='text-sm'>Ciclo de facturación</h4>
                <p className='text-xs'>01 Jul 2024 - 01 - Ago - 2024</p>
              </div>
            </div>
          </Card>
        </div>
        <div className="w-full relative">
          <div className="p-4 w-full">
            <div className="flex justify-between">
              <div>
                <h4>Consumo energético (kWH)</h4>
                <p className="text-xs">Durante el periodo seleccionado</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p>Por día</p>
                </div>
                <div>
                  <p>Por mes</p>
                </div>
                <div>
                  <p>Consumo en S/</p>
                </div>
              </div>
            </div>  
            <TarifarioChart/>
          </div>
          <div className="absolute bg-slate-100 -top-[56px] flex">
            <OptionBar/>
          </div>
        </div>
      </div>
    </div>
  )
}
