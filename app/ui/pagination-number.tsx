'use client'
import React, { useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function PaginationNumberComponent({ count, itemsPerPage }) {

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const params = new URLSearchParams(searchParams)
  const page = params.get('page')

  const totalPages = Math.ceil(count / itemsPerPage)

  const handlePageChange = (page: number) => {

    const params = new URLSearchParams(searchParams)
    if (page === 0) {
      params.delete('page')
    } else {
      params.set('page', page.toString())
    }
    replace(`${pathname}?${params.toString()}`)
  }

  const pageNumbers = []
  
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= Number(page) - 1 && i <= Number(page) + 1)
    ) {
      pageNumbers.push(i)
    } else if (i === Number(page) - 2 || i === Number(page) + 2) {
      pageNumbers.push('...')
    }
  }

  const startIndex = (Number(page) - 1) * itemsPerPage + 1
  const endIndex = Math.min(startIndex + itemsPerPage - 1, count)

  return (
    <div className="flex flex-col items-center space-y-2 md:flex-row md:justify-between md:space-y-0 p-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                if (Number(page) > 1) handlePageChange(Number(page) - 1)
              }}
            />
          </PaginationItem>
          
          {pageNumbers.map((pageNumber, index) => (
            <PaginationItem key={index}>
              {pageNumber === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink 
                  href="#" 
                  isActive={Number(page) === pageNumber}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(pageNumber as number)
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                if (Number(page) < totalPages) handlePageChange(Number(page) + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="text-sm text-gray-600 text-nowrap">
        Mostrando del {startIndex} al {endIndex} de {count} resultados
      </p>
    </div>
  )
}

