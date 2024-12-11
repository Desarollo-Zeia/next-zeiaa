import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"

type Props = {
    name: string,
    status: string,
    isActivated: boolean
}

export default function RoomStatusCard(
  {
    name,
    status,
    isActivated,
  } : Props
) {

  return (
    <Card className="max-w-xs shadow-lg">
      <CardContent className="p-6"> 
        {/* Top Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Image src='https://utfs.io/f/y8yAFIxNrCH6xltOgtMQNWRFGe0pAcYU5bZ6nSwJOCPqIh4g' alt="face" width={64} height={64} className="object-fit"/>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold capitalize block text-balance text-right">{ name }</span>
            <span className="text-sm text-right text-green-500 font-semibold block">{ status }</span>
          </div>
        </div>

        {/* Middle Section */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Sensor:</span>
            <span className="text-sm">24e124710c485887</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Estado:</span>
            <span className="text-sm">{isActivated ? true : false}</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-sm text-muted-foreground mb-4">
          Torre Hospitalización
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          Ir a detalles de la sala
        </Button>
      </CardFooter>
    </Card>
  )
}

