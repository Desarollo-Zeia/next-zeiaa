import { fetchWithAuth } from "@/app/lib/api"

export async function roomLastData({ roomId } : { roomId : string | number } ) {
  const res = await fetchWithAuth(`/readings/api/room/${roomId}/general/last`)
  
  return res 
}
