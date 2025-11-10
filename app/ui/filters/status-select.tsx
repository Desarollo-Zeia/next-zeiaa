'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTransition } from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { STATUS_TO_SPANISH } from "@/app/utils/formatter";

export default function StatusSelect({ status_filter }: { status_filter?: string[] }) {

  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChangeStatus = (status: string) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams);

      newParams.set('page', '1');

      if (status) {
        newParams.set('status', status);
      }

      if (status === 'none') {
        newParams.delete('status');
      }

      replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="relative">
      <Select onValueChange={handleChangeStatus}>
        <SelectTrigger className="w-[180px] text-black bg-[#00b0c7]">
          <SelectValue placeholder={isPending ? "Cargando..." : "Selecciona estado"}
            className="text-white font-bold" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="none">Sin estado</SelectItem>
            {
              status_filter?.map((status: string) => (
                <SelectItem key={status} value={status}>{STATUS_TO_SPANISH[status as keyof typeof STATUS_TO_SPANISH]}</SelectItem>
              ))
            }
          </SelectGroup>
        </SelectContent>
      </Select>
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  )
}
