'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { PlugZap, Unplug } from "lucide-react"
import { useRoom } from "@/app/utils/func"
import RoomToggleImage from "./room-toggle-image"

type Props = {
  name: string,
  status: string,
  isActivated: boolean,
  room: number,
  devEUI: string,
  headquarter: string
}

export default function RoomStatusCard(
  {
    name,
    // status,
    isActivated,
    room,
    devEUI,
    headquarter
  }: Props
) {

  const pathname = usePathname()

  const { changeRoom } = useRoom()

  const [, s, t, ,] = pathname.split('/')

  return (
    <Card className="w-auto shadow-lg">
      <CardContent className="p-6">
        {/* Top Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {isActivated ? <PlugZap size={40} className="text-green-400" /> : <Unplug size={40} className="text-red-400" />}
            {/* <Image src={'/zeia-burguer.png'} height={40} width={40} alt="logo" className="ze" /> */}

          </div>
          <div className="flex flex-col">
            <span className="font-semibold capitalize block text-balance text-right">{name}</span>
            {/* <span className={`text-sm text-right font-semibold block ${isActivated ? STATUS_COLOR[status as Status] : 'text-gray-400'}`}>{STATUS_TO_SPANISH[status as Status]}</span> */}
          </div>
        </div>

        {/* Middle Section */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            {/* <span className="text-sm font-medium">Sensor:</span> */}
            {/* <span className="text-sm">{ devEUI ? devEUI : 'No disponible' }</span> */}
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Estado:</span>
            <div className="flex items-center gap-2">
              <p className="text-sm">{isActivated ? 'Conectado' : 'Desconectado'}</p>
              {/* { isActivated ? <div className={styles.blinkingcircleGreen}/> : <div className={styles.blinkingcircleRed}/>} */}
              <div className={`relative w-3 h-3 rounded-full ${isActivated ? 'bg-green-400' : 'bg-red-400'
                }`} style={{
                  animation: 'blink 1.5s ease-in-out infinite'
                }}></div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-sm text-muted-foreground mb-4">
          {headquarter}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 gap-2">
        <Button asChild variant="default" className="flex-1">
          <Link
            href={{
              pathname: `/${s}/${t}/monitoreo`,
              query: { room, devEUI }
            }}
            onClick={() => changeRoom(room.toString())}
          >
            Ir a detalles de la sala
          </Link>
        </Button>

        <RoomToggleImage roomId={room} name={name} />
      </CardFooter>
    </Card>
  )
}

