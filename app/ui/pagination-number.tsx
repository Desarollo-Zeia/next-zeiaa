'use client'
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
import { useTransition } from "react"

export default function PaginationNumberComponent({ count, itemsPerPage }: { count: number, itemsPerPage: number }) {

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition();

  const params = new URLSearchParams(searchParams)
  const page = Number(params.get('page')) || 1

  const totalPages = Math.ceil(count / itemsPerPage)

  const handlePageChange = (page: number) => {
    console.log(page)
    const params = new URLSearchParams(searchParams)
    startTransition(() => {
      if (page === 0) {
        params.delete('page')
      } else {
        params.set('page', page.toString())
      }
      replace(`${pathname}?${params.toString()}`, { scroll: false })
    })


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
    <div className="flex flex-col items-center space-y-2 md:flex-col md:justify-start md:items-start md:space-y-0 p-4 relative">
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
                isPending ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00b0c7]"></div>
                  </div>
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
                )
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
      <p className="text-sm text-gray-600 text-nowrap text-left ml-4">
        Mostrando del {startIndex} al {endIndex} de {count}
      </p>
    </div>
  )
}

