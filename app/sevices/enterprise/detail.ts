import { fetchWithAuth } from "@/app/lib/api"

export async function detail() {
  const res = await fetchWithAuth('/enterprise/api/enterprise/detail/')
  
  return res 
}
