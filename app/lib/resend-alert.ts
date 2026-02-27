'use server'

import { Resend } from 'resend'

const resend = new Resend('re_VjtPGRVm_4WyxKjjDpL7wEo1474ickXhn')

export type AlertType = 'AVISO' | 'PERSISTENCIA'
export type VoltageAlertType = 'VOLTAGE_INFERIOR' | 'VOLTAGE_SUPERIOR'

interface AlertEmailParams {
  roomName: string
  indicator: string
  value: number
  threshold: number
  unit: string
  alertType: AlertType
  detectedAt: string
}

interface VoltageAlertEmailParams {
  headquarterName: string
  headquarterId: string
  panelId: string
  panelName: string
  measurementPointId: string
  measurementPointName: string
  capacity: string
  currentValue: number
  thresholdType: 'inferior' | 'superior'
  thresholdValue: number
  detectedAt: string
}

export async function sendAlertEmail({
  roomName,
  indicator,
  value,
  threshold,
  unit,
  alertType,
  detectedAt,
}: AlertEmailParams): Promise<{ success: boolean; error?: string }> {
  const indicatorSpanish = {
    CO2: 'CO₂ (Dióxido de Carbono)',
    TEMPERATURE: 'Temperatura',
    HUMIDITY: 'Humedad Relativa',
  }[indicator] || indicator

  const alertTypeColors = {
    AVISO: {
      bg: '#fff7ed',
      border: '#f97316',
      text: '#c2410c',
      badge: '#f97316',
    },
    PERSISTENCIA: {
      bg: '#fef2f2',
      border: '#dc2626',
      text: '#b91c1c',
      badge: '#dc2626',
    },
  }

  const style = alertTypeColors[alertType]

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alerta ZEIA - ${indicatorSpanish}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #00b0c7 0%, #0891b2 100%); padding: 32px 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">
                      ⚠️ Alerta ZEIA
                    </h1>
                    <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.85); font-size: 14px;">
                      Sistema de Monitoreo en Tiempo Real
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Alert Type Badge -->
          <tr>
            <td style="padding: 24px 32px 0;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: ${style.bg}; border: 2px solid ${style.border}; border-radius: 8px; padding: 8px 16px;">
                    <span style="color: ${style.badge}; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
                      ${alertType === 'AVISO' ? '📌 Primera Alerta' : '🔴 Alerta Persistente'}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 24px 32px;">
              <p style="margin: 0 0 20px; color: #334155; font-size: 15px; line-height: 1.6;">
                Se ha detectado que un valor ha superado el umbral permitido en el sistema de monitoreo.
              </p>

              <!-- Alert Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${style.bg}; border: 1px solid ${style.border}; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <!-- Room -->
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid ${style.border}40;">
                          <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Sala / Ubicación</span>
                          <p style="margin: 4px 0 0; color: ${style.text}; font-size: 18px; font-weight: 600;">${roomName}</p>
                        </td>
                      </tr>
                      <!-- Indicator -->
                      <tr>
                        <td style="padding: 12px 0 8px; border-bottom: 1px solid ${style.border}40;">
                          <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Indicador</span>
                          <p style="margin: 4px 0 0; color: #1e293b; font-size: 16px; font-weight: 600;">${indicatorSpanish}</p>
                        </td>
                      </tr>
                      <!-- Values -->
                      <tr>
                        <td style="padding: 12px 0 8px;">
                          <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Valores</span>
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 8px;">
                            <tr>
                              <td style="padding: 8px 12px; background-color: rgba(220, 38, 38, 0.1); border-radius: 6px;">
                                <span style="color: #dc2626; font-size: 11px; text-transform: uppercase;">Valor Actual</span>
                                <p style="margin: 2px 0 0; color: #dc2626; font-size: 20px; font-weight: 700;">${value} ${unit}</p>
                              </td>
                              <td style="width: 12px;"></td>
                              <td style="padding: 8px 12px; background-color: rgba(34, 197, 94, 0.1); border-radius: 6px;">
                                <span style="color: #16a34a; font-size: 11px; text-transform: uppercase;">Umbral Límite</span>
                                <p style="margin: 2px 0 0; color: #16a34a; font-size: 20px; font-weight: 700;">${threshold} ${unit}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <!-- Time -->
                      <tr>
                        <td style="padding: 12px 0 8px;">
                          <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Detectado</span>
                          <p style="margin: 4px 0 0; color: #1e293b; font-size: 14px; font-weight: 500;">${detectedAt}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 0 32px 32px;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
                Este correo fue enviado automáticamente por el sistema de monitoreo ZEIA.<br>
                No responder a este mensaje.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  try {
    await resend.emails.send({
      from: 'Alertas ZEIA <onboarding@resend.dev>',
      to: ['alonsomorante11@gmail.com'],
      subject: `[ZEIA] ${alertType === 'AVISO' ? '⚠️' : '🚨'} Alerta: ${indicatorSpanish} excedido en ${roomName}`,
      html,
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending alert email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function sendVoltageAlertEmail({
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
}: VoltageAlertEmailParams): Promise<{ success: boolean; error?: string }> {
  const isLower = thresholdType === 'inferior'

  const capacityMatch = capacity.match(/^(\d+)v\//i)
  const nominalVoltage = capacityMatch ? capacityMatch[1] : 'N/A'

  const alertTitle = isLower ? 'Voltaje Bajo' : 'Voltaje Alto'
  const alertDescription = isLower 
    ? `El voltaje ha caído por debajo del umbral mínimo (${thresholdValue.toFixed(0)}V)`
    : `El voltaje ha superado el umbral máximo (${thresholdValue.toFixed(0)}V)`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alerta de Voltaje ZEIA</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #00b0c7; padding: 24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">
                      Alerta de Voltaje
                    </h1>
                    <p style="margin: 4px 0 0; color: rgba(255, 255, 255, 0.85); font-size: 13px;">
                      Sistema de Monitoreo ZEIA
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background-color: ${isLower ? '#fff7ed' : '#fef2f2'}; padding: 20px 32px; border-bottom: 1px solid ${isLower ? '#fed7aa' : '#fecaca'};">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: ${isLower ? '#f97316' : '#dc2626'}; border-radius: 6px; padding: 8px 16px; display: inline-block;">
                    <span style="color: #ffffff; font-size: 13px; font-weight: 600; text-transform: uppercase;">
                      ${isLower ? '⚠️ VOLTAJE BAJO' : '⚠️ VOLTAJE ALTO'}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px; color: #334155; font-size: 15px; line-height: 1.5;">
                ${alertDescription}
              </p>

              <!-- Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <span style="color: #64748b; font-size: 11px; text-transform: uppercase;">Sede</span>
                          <p style="margin: 2px 0 0; color: #1e293b; font-size: 14px; font-weight: 600;">${headquarterName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <span style="color: #64748b; font-size: 11px; text-transform: uppercase;">Panel</span>
                          <p style="margin: 2px 0 0; color: #1e293b; font-size: 14px; font-weight: 600;">${panelName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <span style="color: #64748b; font-size: 11px; text-transform: uppercase;">Punto de Medición</span>
                          <p style="margin: 2px 0 0; color: #0891b2; font-size: 14px; font-weight: 600;">${measurementPointName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <span style="color: #64748b; font-size: 11px; text-transform: uppercase;">Voltaje Nominal</span>
                          <p style="margin: 2px 0 0; color: #0891b2; font-size: 16px; font-weight: 600;">${nominalVoltage}V</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0 8px;">
                          <span style="color: #64748b; font-size: 11px; text-transform: uppercase;">Lectura</span>
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 6px;">
                            <tr>
                              <td style="padding: 8px 12px; background-color: ${isLower ? '#fff7ed' : '#fef2f2'}; border-radius: 6px; border: 1px solid ${isLower ? '#fed7aa' : '#fecaca'};">
                                <span style="color: ${isLower ? '#c2410c' : '#dc2626'}; font-size: 10px; text-transform: uppercase;">Actual</span>
                                <p style="margin: 2px 0 0; color: ${isLower ? '#c2410c' : '#dc2626'}; font-size: 18px; font-weight: 700;">${currentValue.toFixed(1)} V</p>
                              </td>
                              <td style="width: 8px;"></td>
                              <td style="padding: 8px 12px; background-color: #f0fdf4; border-radius: 6px; border: 1px solid #bbf7d0;">
                                <span style="color: #16a34a; font-size: 10px; text-transform: uppercase;">Umbral</span>
                                <p style="margin: 2px 0 0; color: #16a34a; font-size: 18px; font-weight: 700;">${thresholdValue.toFixed(0)} V</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0 0;">
                          <span style="color: #64748b; font-size: 11px; text-transform: uppercase;">Fecha/Hora</span>
                          <p style="margin: 2px 0 0; color: #475569; font-size: 13px;">${detectedAt}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://administrador.zeia.com.pe/energia/dashboard/home" style="display: inline-block; background-color: #00b0c7; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 8px;">
                      Ver Monitoreo
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px 32px 24px; background-color: #f8fafc;">
              <p style="margin: 0; color: #94a3b8; font-size: 11px; text-align: center;">
                Correo enviado automáticamente por ZEIA
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  try {
    await resend.emails.send({
      from: 'Alertas ZEIA <onboarding@resend.dev>',
      to: ['alonsomorante11@gmail.com'],
      subject: `[ZEIA] ${isLower ? '⚠️' : '⚠️'} Alerta: ${alertTitle} - ${headquarterName} / ${panelName}`,
      html,
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending voltage alert email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
