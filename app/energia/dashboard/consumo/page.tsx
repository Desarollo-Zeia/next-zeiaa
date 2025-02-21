import TableComponent from "@/app/ui/energia/consumo/table";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSearchFilter from "@/app/ui/filters/search";

export default function page() {
  return (
    <div>
      <FiltersContainer>
        <RoomSearchFilter/>
      </FiltersContainer>
      <TableComponent/>
    </div>
  )
}
