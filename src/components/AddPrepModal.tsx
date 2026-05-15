import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from './GlassCard'
import PrimaryButton from './PrimaryButton'

type Section = 'Video' | 'Notes' | 'Questions'

interface AddPrepModalProps {
  isOpen: boolean
  onClose: () => void
  section: Section
}

const CLASS_NAMES = ['frontend', 'backend', 'NLP', 'React', 'React-Native', 'NextJS', 'MongoDB']

export default function AddPrepModal({ isOpen, onClose, section }: AddPrepModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    youtubeLink: '',
    className: '',
    description: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (formData.className) {
      const filtered = CLASS_NAMES.filter(c => 
        c.toLowerCase().includes(formData.className.toLowerCase()) && 
        c.toLowerCase() !== formData.className.toLowerCase()
      )
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [formData.className])

  const validateForm = () => {
    if (formData.title.length < 5 || formData.title.length > 120) {
      return 'Title must be between 5 and 120 characters'
    }
    if (!/^[a-z0-9-]+$/.test(formData.className)) {
      return 'Class name must be kebab-case (lowercase, numbers, and hyphens only)'
    }
    if (formData.className.length < 3 || formData.className.length > 30) {
      return 'Class name must be between 3 and 30 characters'
    }
    if (section === 'Video') {
      const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
      if (!ytRegex.test(formData.youtubeLink)) {
        return 'Invalid YouTube link'
      }
      if (!file) return 'Cover image is required'
    } else {
      if (!file) return 'File is required'
      if (formData.description.length > 500) {
        return 'Description must be 500 characters or less'
      }
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    
    const error = validateForm()
    if (error) {
      setMessage({ type: 'error', text: error })
      return
    }

    setLoading(true)
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      // Simulation of API call
      // In a real scenario, use FormData and fetch to /api/admin/{section}
      const payload = new FormData()
      payload.append('title', formData.title)
      payload.append('className', formData.className)
      if (section === 'Video') {
        payload.append('youtubeLink', formData.youtubeLink)
        payload.append('coverImage', file!)
      } else {
        payload.append('file', file!)
        payload.append('description', formData.description)
      }

      // Mocking the fetch
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setProgress(100)
      setMessage({ type: 'success', text: `${section} added successfully!` })
      
      setTimeout(() => {
        onClose()
        setFormData({ title: '', youtubeLink: '', className: '', description: '' })
        setFile(null)
        setMessage(null)
        setLoading(false)
        setProgress(0)
      }, 2000)

    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add item. Please try again.' })
      setLoading(false)
    } finally {
      clearInterval(interval)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg my-8"
          >
            <GlassCard className="p-8 space-y-6 relative">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                ✕
              </button>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Add New {section}</h2>
                <p className="text-gray-400 text-sm">Fill in the details for the new preparation material.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter title (5-120 chars)"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition focus:border-[#C7B8FF] focus:ring-2 focus:ring-[#C7B8FF]/35"
                  />
                </div>

                {/* Section Specific Fields */}
                {section === 'Video' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">YouTube Link</label>
                    <input
                      type="url"
                      required
                      value={formData.youtubeLink}
                      onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition focus:border-[#C7B8FF] focus:ring-2 focus:ring-[#C7B8FF]/35"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Description (Optional)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter description (max 500 chars)"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition focus:border-[#C7B8FF] focus:ring-2 focus:ring-[#C7B8FF]/35 min-h-[100px]"
                    />
                  </div>
                )}

                {/* Class Name (Kebab-case + Autocomplete) */}
                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-gray-300 ml-1">Key Class Name</label>
                  <input
                    type="text"
                    required
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    placeholder="e.g. react-native, frontend"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition focus:border-[#C7B8FF] focus:ring-2 focus:ring-[#C7B8FF]/35"
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-[#1A1F2E] border border-white/10 rounded-xl overflow-hidden shadow-xl">
                      {suggestions.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFormData({ ...formData, className: s })}
                          className="w-full px-6 py-3 text-left text-sm text-gray-300 hover:bg-white/5 transition"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">
                    {section === 'Video' ? 'Cover Image (JPG/PNG, Max 2MB)' : 'File (PDF/PPT/DOCX, Max 10MB)'}
                  </label>
                  <div className="relative group">
                    <input
                      type="file"
                      accept={section === 'Video' ? 'image/png, image/jpeg' : '.pdf,.ppt,.pptx,.doc,.docx'}
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label 
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full min-h-[120px] rounded-2xl border-2 border-dashed border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 hover:border-[#C7B8FF]/50 transition group"
                    >
                      {file ? (
                        <div className="text-center px-4">
                          <p className="text-[#C7B8FF] font-medium truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <>
                          <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📁</span>
                          <span className="text-sm text-gray-400">Click to upload file</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Progress Indicator */}
                {loading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Uploading...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <motion.div 
                        className="bg-[#C7B8FF] h-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Feedback Messages */}
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl text-sm border ${
                      message.type === 'success' 
                        ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                        : 'bg-red-500/10 border-red-500/50 text-red-400'
                    }`}
                  >
                    {message.text}
                  </motion.div>
                )}

                <PrimaryButton 
                  type="submit" 
                  className="w-full h-14 text-lg font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Add to ${section}`}
                </PrimaryButton>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
