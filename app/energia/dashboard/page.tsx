import { consume } from "@/app/sevices/energy/data";
import TableComponent from "@/app/ui/energia/consumo/table";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSearchFilter from "@/app/ui/filters/search";

export default async function page() {

  const readings = await consume({ date_after: '2025-02-18', date_before: '2025-02-21' })

  return (
    <div className="w-full">
      <FiltersContainer>
        <RoomSearchFilter/>
      </FiltersContainer>
      <TableComponent readings={readings.results} count={readings.count}/>
    </div>
  )
}
