import { getCompanyData } from "@/app/lib/auth"
import { armonics } from "@/app/sevices/energy/distorsion/data"
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data"
import { SearchParams } from "@/app/type"
import CurrentVoltageToggle from "@/app/ui/energia/distorsion/current-voltage-toggle"
import { DateRangePicker } from "@/app/ui/energia/filters/datepicker-energy-filter"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
import FiltersContainer from "@/app/ui/filters/filters-container"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

export default async function page({ searchParams } : SearchParams) {

const { companies } = await getCompanyData()
    
const { headquarter = '1' , panel = '1',  date_after = format(new Date(), 'yyyy-MM-dd'), date_before = format(new Date(), 'yyyy-MM-dd'), data_type = 'current'} = await searchParams

const energyDetails = await getEnergyCompanyDetails({ headquarterId: companies[0].id })

 const armonicsReadings = await armonics({ headquarterId: headquarter, panelId: panel, date_after, date_before, data_type })

 console.log(armonicsReadings)

  return (
    <div className="w-full">
        <FiltersContainer>
            <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
            <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters[0].electrical_panels} />
            <DateRangePicker/>
        </FiltersContainer>
        <div className="mx-6">
            <CurrentVoltageToggle type={data_type}/>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>THDIa</TableHead>
                    <TableHead>THDIb</TableHead>
                    <TableHead>THDIc</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sampleData.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.time}</TableCell>
                        <TableCell>{formatValue(item.current.THDIa)}</TableCell>
                        <TableCell>{formatValue(item.current.THDIb)}</TableCell>
                        <TableCell>{formatValue(item.current.THDIc)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

    </div>
  )
}
