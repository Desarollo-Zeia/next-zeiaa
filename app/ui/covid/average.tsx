import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function AverageCard({ title, children }) {
  return (
    <Card>
          <CardTitle className="text-base font-bold text-center bg-[#00b7ca] px-12 py-2 rounded-lg text-white text-nowrap">
            { title }
          </CardTitle>
        <CardContent className="text-sm">
          { children }
        </CardContent>
    </Card>
  )
}
