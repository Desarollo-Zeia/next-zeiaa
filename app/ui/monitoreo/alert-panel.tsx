'use client'

import { useState, useEffect } from 'react'
import { X, Bell, History, AlertTriangle, CheckCircle2, Clock, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AlertToastType } from './alert-toast'

export interface ActiveAlert {
  id: string
  roomId: number
  roomName: string
  indicator: string
  value: number
  threshold: number
  unit: string
  exceededAt: string
  avisoSent: boolean
  persistenciaSent: boolean
}

export interface ResolvedAlert {
  id: string
  roomName: string
  indicator: string
  maxValue: number
  threshold: number
  unit: string
  startedAt: string
  resolvedAt: string
  duration: number
  avisoSent: boolean
  persistenciaSent: boolean
}

interface AlertPanelProps {
  isOpen: boolean
  onClose: () => void
  activeAlerts: ActiveAlert[]
  resolvedAlerts: ResolvedAlert[]
  onDismiss: (id: string) => void
  onClearHistory: () => void
}

const indicatorSpanish: Record<string, string> = {
  CO2: 'CO₂',
  TEMPERATURE: 'Temperatura',
  HUMIDITY: 'Humedad',
}

function AlertItem({ alert, onDismiss, isResolved = false }: { alert: ActiveAlert | ResolvedAlert; onDismiss: (id: string) => void; isResolved: boolean }) {
  const startTime = new Date(('startedAt' in alert ? alert.startedAt : alert.exceededAt))
  const now = new Date()
  const minutesAgo = Math.floor((now.getTime() - startTime.getTime()) / 60000)

  const displayIndicator = indicatorSpanish[alert.indicator] || alert.indicator
  const exceededValue = 'value' in alert ? alert.value : alert.maxValue

  const getStatus = () => {
    if (isResolved) {
      return {
        label: 'Resuelto',
        color: 'text-green-600',
        bg: 'bg-green-100',
        icon: <CheckCircle2 className="w-4 h-4" />,
      }
    }
    const activeAlert = alert as ActiveAlert
    if (activeAlert.persistenciaSent) {
      return {
        label: 'Persistencia',
        color: 'text-red-600',
        bg: 'bg-red-100',
        icon: <AlertTriangle className="w-4 h-4 animate-pulse" />,
      }
    }
    if (activeAlert.avisoSent) {
      return {
        label: 'Aviso enviado',
        color: 'text-orange-600',
        bg: 'bg-orange-100',
        icon: <Clock className="w-4 h-4" />,
      }
    }
    return {
      label: `Detectado (${minutesAgo}min)`,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
      icon: <Clock className="w-4 h-4" />,
    }
  }

  const status = getStatus()

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 truncate">{alert.roomName}</span>
          <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1', status.bg, status.color)}>
            {status.icon}
            {status.label}
          </span>
        </div>
        {!isResolved && (
          <button
            onClick={() => onDismiss(alert.id)}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Descartar
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-500">{displayIndicator}</span>
        <span>
          <strong className="text-red-600">{exceededValue}</strong> {alert.unit}
        </span>
        <span className="text-gray-400">umbral: {alert.threshold} {alert.unit}</span>
        {!isResolved && (
          <span className="text-red-500 font-medium">
            +{exceededValue - alert.threshold} {alert.unit}
          </span>
        )}
      </div>

      {isResolved ? (
        <div className="text-xs text-gray-500">
          Duración: {Math.floor((alert as ResolvedAlert).duration)} min | 
          Resuelto a las {new Date((alert as ResolvedAlert).resolvedAt).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                minutesAgo >= 10 ? 'bg-red-500' : minutesAgo >= 5 ? 'bg-orange-500' : 'bg-amber-500'
              )}
              style={{ width: `${Math.min((minutesAgo / 10) * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {minutesAgo < 1 ? '<1 min' : `${minutesAgo} min`}
          </span>
        </div>
      )}
    </div>
  )
}

export function AlertPanel({
  isOpen,
  onClose,
  activeAlerts,
  resolvedAlerts,
  onDismiss,
  onClearHistory,
}: AlertPanelProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const todayResolved = resolvedAlerts.filter((alert) => {
    const alertDate = new Date(alert.resolvedAt).toDateString()
    const today = new Date().toDateString()
    return alertDate === today
  })

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">
              Alertas
            </h2>
            {activeAlerts.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {activeAlerts.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('active')}
            className={cn(
              'flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2',
              activeTab === 'active'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <AlertTriangle className="w-4 h-4" />
            Activas ({activeAlerts.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              'flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2',
              activeTab === 'history'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <History className="w-4 h-4" />
            Historial ({todayResolved.length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'active' ? (
            activeAlerts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <p className="font-medium">Sin alertas activas</p>
                <p className="text-sm">Todos los valores están dentro de los umbrales</p>
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  onDismiss={onDismiss}
                  isResolved={false}
                />
              ))
            )
          ) : (
            todayResolved.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">Sin historial hoy</p>
                <p className="text-sm">Las alertas resueltas aparecerán aquí</p>
              </div>
            ) : (
              <>
                <div className="flex justify-end">
                  <button
                    onClick={onClearHistory}
                    className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Limpiar historial
                  </button>
                </div>
                {todayResolved.map((alert) => (
                  <AlertItem
                    key={alert.id}
                    alert={alert}
                    onDismiss={() => {}}
                    isResolved={true}
                  />
                ))}
              </>
            )
          )}
        </div>
      </div>
    </div>
  )
}
