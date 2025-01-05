
interface FiltersContainerProps {
  children: React.ReactNode
}


export default function FiltersContainer({ children } : FiltersContainerProps) {
  return (
    <div className="pr-4 pt-4 justify-end gap-4 hidden md:flex">
      { children }
    </div>
  )
}
