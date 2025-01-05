import { fetchWithAuth } from "@/app/lib/api";
import HeadquarterSelect from "./headquarter-select";

export default async function HeadquarterSelectFilter() {

  const headquarters = await fetchWithAuth('/enterprise/api/enterprise/basic/headquearter-list/')

  return ( 
    <HeadquarterSelect headquarters={headquarters}/>
  )
}
