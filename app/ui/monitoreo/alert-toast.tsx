'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, X, CheckCircle2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AlertToastType = 'DETECTED' | 'AVISO' | 'PERSISTENCIA' | 'RESOLVED'

interface AlertToastProps {
  id: string
  roomName: string
  indicator: string
  value: number
  threshold: number
  unit: string
  type: AlertToastType
  onClose: (id: string) => void
}

const alertConfig = {
  DETECTED: {
    title: '⚠️ Alerta Detectada',
    bg: 'bg-amber-50 border-amber-300',
    icon: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-800',
  },
  AVISO: {
    title: '📧 Aviso Enviado',
    bg: 'bg-orange-50 border-orange-300',
    icon: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-800',
  },
  PERSISTENCIA: {
    title: '🚨 Alerta Persistente',
    bg: 'bg-red-50 border-red-300',
    icon: 'text-red-600',
    badge: 'bg-red-100 text-red-800',
  },
  RESOLVED: {
    title: '✅ Alerta Resuelta',
    bg: 'bg-green-50 border-green-300',
    icon: 'text-green-600',
    badge: 'bg-green-100 text-green-800',
  },
}

export function AlertToast({
  id,
  roomName,
  indicator,
  value,
  threshold,
  unit,
  type,
  onClose,
}: AlertToastProps) {
  const config = alertConfig[type]
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onClose(id), 300)
    }, 5000)
    return () => clearTimeout(timer)
  }, [id, onClose])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => onClose(id), 300)
  }

  const indicatorSpanish: Record<string, string> = {
    CO2: 'CO₂',
    TEMPERATURE: 'Temperatura',
    HUMIDITY: 'Humedad',
  }

  const displayIndicator = indicatorSpanish[indicator] || indicator

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300',
        config.bg,
        isVisible && !isExiting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
    >
      <div className={cn('mt-0.5', config.icon)}>
        {type === 'RESOLVED' ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : type === 'PERSISTENCIA' ? (
          <AlertTriangle className="w-5 h-5 animate-pulse" />
        ) : (
          <Clock className="w-5 h-5" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn('text-sm font-semibold', config.icon)}>
            {config.title}
          </span>
          <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', config.badge)}>
            {displayIndicator}
          </span>
        </div>

        <p className="text-sm font-medium text-gray-900 truncate">{roomName}</p>

        <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
          <span>
            <strong className="text-red-600">{value}</strong> {unit}
          </span>
          <span>umbral: {threshold} {unit}</span>
          {type !== 'RESOLVED' && (
            <span className="text-red-500 font-medium">
              +{value - threshold} {unit}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
