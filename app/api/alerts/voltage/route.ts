import { NextRequest, NextResponse } from 'next/server'
import { sendVoltageAlertEmail } from '@/app/lib/resend-alert'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      headquarterName,
      headquarterId,
      panelId,
      panelName,
      measurementPointId,
      measurementPointName,
      capacity,
      currentValue,
      thresholdType,
      thresholdValue,
      detectedAt,
      indicator,
      indicatorName,
    } = body

    if (
      !headquarterName ||
      !headquarterId ||
      !panelId ||
      !panelName ||
      !measurementPointId ||
      !measurementPointName ||
      !capacity ||
      currentValue === undefined ||
      !thresholdType ||
      !thresholdValue ||
      !detectedAt ||
      !indicator ||
      !indicatorName
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await sendVoltageAlertEmail({
      headquarterName,
      headquarterId,
      panelId,
      panelName,
      measurementPointId,
      measurementPointName,
      capacity,
      currentValue,
      thresholdType,
      thresholdValue,
      detectedAt,
      indicator,
      indicatorName,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in voltage alert API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
