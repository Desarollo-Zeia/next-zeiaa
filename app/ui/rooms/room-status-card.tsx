import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { SmilePlus, Meh, Frown } from 'lucide-react'

// interface RoomStatusCardProps {
//   status: "good" | "warning" | "critical"
//   roomName: string
//   sensorCode: string
//   sensorStatus: string
//   location: string
//   onDetailsClick: () => void
// }

export default function RoomStatusCard() {
  const getStatusIcon = (status : string) => {
    switch (status) {
      case "good":
        return <SmilePlus className="h-6 w-6 text-green-500" />
      case "warning":
        return <Meh className="h-6 w-6 text-yellow-500" />
      case "critical":
        return <Frown className="h-6 w-6 text-red-500" />
    }
  }

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardContent className="p-6">
        {/* Top Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getStatusIcon('good')}
            <span className="font-semibold capitalize">Forced Names</span>
          </div>
          <span className="text-sm text-muted-foreground">Forced Names</span>
        </div>

        {/* Middle Section */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Sensor:</span>
            <span className="text-sm">Forced Names</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Status:</span>
            <span className="text-sm">Forced Names</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-sm text-muted-foreground mb-4">
          Location: Forced Names
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          Go to Room Details
        </Button>
      </CardFooter>
    </Card>
  )
}

