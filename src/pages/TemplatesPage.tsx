import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getTemplatesApi } from '../lib/api'
import type { InterviewTemplate } from '../lib/api'
import GlassCard from '../components/GlassCard'
import AppFooter from '../components/AppFooter'
import LoadingSpinner from '../components/LoadingSpinner'
import { DashboardLayout } from '../layout/DashboardLayout'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

function TemplatesPage() {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState<InterviewTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplatesApi()
        setTemplates(data)
      } catch (error) {
        console.error('Failed to fetch templates:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [])

  // handleTemplateSelect is used inline on the card click
  const handleTemplateSelect = (template: InterviewTemplate) => {
    navigate('/interview/setup', { state: { role: template.role, type: template.type } })
  }

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <motion.div {...fadeInUp}>
          <h1 className="text-3xl font-bold text-white/90">Interview Prep</h1>
          <p className="text-white/60 mt-2">Select a pre-configured template to jumpstart your interview practice.</p>
        </motion.div>

        {loading && <LoadingSpinner message="Loading templates…" />}
        {!loading && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, idx) => (
            <motion.div
              key={template._id}
              {...fadeInUp}
              transition={{ delay: idx * 0.1 }}
            >
              <button type="button" onClick={() => handleTemplateSelect(template)} className="w-full text-left">
              <GlassCard
                className="group relative flex h-full flex-col p-8 transition-all hover:bg-white/10"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C7B8FF]/10 text-3xl group-hover:scale-110 transition-transform">
                  {template.icon || '💼'}
                </div>
                <h3 className="mb-3 text-xl font-bold text-white group-hover:text-[#C7B8FF] transition-colors">
                  {template.title}
                </h3>
                <p className="mb-6 flex-grow text-sm leading-relaxed text-white/50">
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
                    {template.type}
                  </span>
                  <button
                    onClick={() => handleTemplateSelect(template)}
                    className="text-sm font-bold text-[#C7B8FF] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Use Template →
                  </button>
                </div>
              </GlassCard>
              </button>
            </motion.div>
          ))}
        </div>}

        <AppFooter />
      </section>
    </DashboardLayout>
  )
}

export default TemplatesPage
