import PrimaryButton from './PrimaryButton'

interface PrepHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddItem: () => void
  isAdmin: boolean
}

export default function PrepHeader({ searchQuery, onSearchChange, onAddItem, isAdmin }: PrepHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <h1 className="text-3xl font-semibold">Interview Preparation</h1>
        <p className="text-sm text-gray-400">Master your skills with curated videos, notes, and questions.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row items-center">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-white/10 bg-white/5 px-10 py-3 text-sm text-white outline-none transition focus:border-[#C7B8FF] focus:ring-2 focus:ring-[#C7B8FF]/35"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
        </div>

        {isAdmin && (
          <PrimaryButton
            onClick={onAddItem}
            className="w-full sm:w-auto px-6 whitespace-nowrap"
          >
            + Add
          </PrimaryButton>
        )}
      </div>
    </div>
  )
}