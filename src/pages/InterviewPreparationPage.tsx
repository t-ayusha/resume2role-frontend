import { useState } from 'react'
import GlassCard from '../components/GlassCard'
import { DashboardLayout } from '../layout/DashboardLayout'
import AppFooter from '../components/AppFooter'
import { useAuth } from '../context/AuthContext'
import PrepHeader from '../components/PrepHeader'
import AddPrepModal from '../components/AddPrepModal'

type Tab = 'Video' | 'Notes' | 'Questions'

interface BaseItem {
  id: number
  title: string
}

interface VideoItem extends BaseItem {
  duration: string
  thumbnail: string
}

interface NoteItem extends BaseItem {
  type: string
  icon: string
}

interface QuestionItem extends BaseItem {
  difficulty: string
  icon: string
}

type PrepItem = VideoItem | NoteItem | QuestionItem

export default function InterviewPreparationPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Video')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isAdmin } = useAuth()

  // Mock data in state
  const [prepData, setPrepData] = useState<{
    Video: VideoItem[]
    Notes: NoteItem[]
    Questions: QuestionItem[]
  }>({
    Video: [
      { id: 1, title: 'React Performance Optimization', duration: '15:20', thumbnail: '🎥' },
      { id: 2, title: 'System Design Fundamentals', duration: '25:45', thumbnail: '🎥' },
      { id: 3, title: 'Behavioral Interview Tips', duration: '12:10', thumbnail: '🎥' },
    ],
    Notes: [
      { id: 1, title: 'JavaScript Closures Explained', type: 'PDF', icon: '📝' },
      { id: 2, title: 'CSS Grid vs Flexbox', type: 'DOC', icon: '📝' },
      { id: 3, title: 'Microservices Architecture', type: 'PDF', icon: '📝' },
    ],
    Questions: [
      { id: 1, title: 'How does the Virtual DOM work?', difficulty: 'Medium', icon: '❓' },
      { id: 2, title: 'Explain the difference between SQL and NoSQL', difficulty: 'Hard', icon: '❓' },
      { id: 3, title: 'What is a load balancer?', difficulty: 'Easy', icon: '❓' },
    ]
  })

  const filteredItems = prepData[activeTab].filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddItem = () => {
    setIsModalOpen(true)
  }

  const handleDeleteItem = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this item?')) {
      setPrepData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(item => item.id !== id)
      }))
    }
  }

  const handleEditItem = (item: PrepItem, e: React.MouseEvent) => {
    e.stopPropagation()
    const newTitle = prompt('Edit Title:', item.title)
    if (newTitle && newTitle !== item.title) {
      setPrepData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(i => i.id === item.id ? { ...i, title: newTitle } : i)
      }))
    }
  }

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <GlassCard className="space-y-6 p-6">
          <PrepHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddItem={handleAddItem}
            isAdmin={isAdmin}
          />

          <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
            {(['Video', 'Notes', 'Questions'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                }}
                className={`flex-1 rounded-xl py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-[#C7B8FF] text-[#0B1020]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <GlassCard key={item.id} className="group relative cursor-pointer border-white/5 bg-white/5 p-5 transition-all hover:bg-white/10 hover:border-[#C7B8FF]/30">
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button 
                        onClick={(e) => handleEditItem(item, e)}
                        className="rounded-lg bg-blue-500/20 p-2 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        className="rounded-lg bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30 transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  )}

                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C7B8FF]/10 text-2xl group-hover:scale-110 transition-transform">
                    {('thumbnail' in item) ? (item as VideoItem).thumbnail : ('icon' in item) ? (item as NoteItem | QuestionItem).icon : '📄'}
                  </div>
                  <h3 className="mb-2 font-medium text-white pr-16">{item.title}</h3>
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span>{('duration' in item) ? (item as VideoItem).duration : ('type' in item) ? (item as NoteItem).type : ('difficulty' in item) ? (item as QuestionItem).difficulty : ''}</span>
                    <span className="text-[#C7B8FF] opacity-0 transition-opacity group-hover:opacity-100">View Details →</span>
                  </div>
                </GlassCard>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500">
                No items found matching "{searchQuery}"
              </div>
            )}
          </div>
        </GlassCard>
        
        <AppFooter />
      </section>

      <AddPrepModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        section={activeTab}
      />
    </DashboardLayout>
  )
}

