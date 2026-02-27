import { NextRequest, NextResponse } from 'next/server'
import { sendVoltageAlertEmail } from '@/app/lib/resend-alert'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      headquarterName,
      headquarterId,
      panelId,
      measurementPointId,
      capacity,
      currentValue,
      thresholdType,
      thresholdValue,
      detectedAt,
    } = body

    if (
      !headquarterName ||
      !headquarterId ||
      !panelId ||
      !measurementPointId ||
      !capacity ||
      currentValue === undefined ||
      !thresholdType ||
      !thresholdValue ||
      !detectedAt
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
      measurementPointId,
      capacity,
      currentValue,
      thresholdType,
      thresholdValue,
      detectedAt,
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
