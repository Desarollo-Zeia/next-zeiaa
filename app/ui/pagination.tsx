'use client'
import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useTransition } from "react"

interface PaginationProps {
  count: number
  itemsPerPage: number
}

export default function PaginationComponent({ count, itemsPerPage }: PaginationProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition();

  const currentOffset = Number(searchParams.get('offset') || '0')
  const currentPage = Math.floor(currentOffset / itemsPerPage) + 1
  const totalPages = Math.ceil(count / itemsPerPage)

  const handlePageChange = (page: number) => {

    startTransition(() => {

      const newOffset = (page - 1) * itemsPerPage
      const params = new URLSearchParams(searchParams)
      if (newOffset === 0) {
        params.delete('offset')
      } else {
        params.set('offset', newOffset.toString())
      }
      replace(`${pathname}?${params.toString()}`, { scroll: false})
    })
  }

  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pageNumbers.push(i)
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pageNumbers.push('...')
    }
  }

  const startItem = currentOffset + 1
  const endItem = Math.min(currentOffset + itemsPerPage, count)

  return (
    <div className="flex flex-col items-center space-y-2 md:flex-row md:justify-between md:space-y-0 p-4 relative">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) handlePageChange(currentPage - 1)
              }}
            />
          </PaginationItem>
          
          {pageNumbers.map((pageNumber, index) => (
            <PaginationItem key={index}>
              {pageNumber === '...' ? (
                <PaginationEllipsis />
              ) : (

                isPending ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00b0c7]"></div>
                  </div>
                ) : (
                  <PaginationLink 
                  href="#" 
                  isActive={currentPage === pageNumber}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(pageNumber as number)
                  }}
                >
                  {pageNumber}
                </PaginationLink>
                )
              
              )}
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages) handlePageChange(currentPage + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      
      <p className="text-sm text-gray-600 text-nowrap">
        Mostrando del {startItem} al {endItem} de {count} resultados
      </p>
    </div>
  )
}

