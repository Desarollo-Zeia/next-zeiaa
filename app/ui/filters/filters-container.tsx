
interface FiltersContainerProps {
  children: React.ReactNode
}


export default function FiltersContainer({ children } : FiltersContainerProps) {
  return (
    <div className="p-4 relative justify-end gap-4 hidden md:flex">
      { children }
    </div>
  )
}
