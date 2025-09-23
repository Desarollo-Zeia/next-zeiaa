'use client'
import { TriangleAlert } from 'lucide-react'
import Link from 'next/link';
import React from 'react'

interface Alert {
  alert_id?: number;
  timestamp?: string;
  status?: string;
  alert_status?: string;
  alert_threshold?: {
    id?: number;
    name?: string;
    alert_type?: string;
    measurement?: string;
    threshold_value?: number;
    enterprise_id?: number;
  };
  alert_location?: {
    headquarter?: string;
    electrical_panel?: string;
    measurement_point?: string;
  };
  reading?: {
    id?: number;
    device_id?: number;
    created_at?: string;
    EPpos_value?: number;
  };
  reported?: boolean;
  reported_at?: string | null;
  whatsapp_reported?: boolean;
  whatsapp_reported_at?: string | null;
  acknowledged_by?: string | null;
  acknowledged_at?: string | null;
  notes?: string | null;
  detail?: string | null;
}

export default function TodayAlertBanner({ alertToday }: { alertToday: Alert }) {
  return (
    <div className={`w-full h-8 absolute top-0 left-0 flex justify-center items-center ${alertToday?.detail ? 'bg-[#16A34A]' : 'bg-[#DC2626]'}`}>
      <p className='flex items-center justify-center gap-2 text-white'>
        <span className='block'>
          <TriangleAlert />
        </span>
        <span className='block text-sm'>
          {alertToday?.detail ? alertToday?.detail : alertToday?.notes}
        </span>
      </p>
      <Link href={"/energia/dashboard/panel/alert"} className='underline absolute right-0 pr-6 text-nowrap text-white text-sm'>
        Historial de alertas
      </Link>
    </div>
  )
}
