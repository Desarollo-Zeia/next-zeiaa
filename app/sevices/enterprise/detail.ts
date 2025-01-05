import { fetchWithAuth } from "@/app/lib/api"

export async function detail() {
  const res = await fetchWithAuth('enterprise/api/enterprise/detail/')
  
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res 
}
