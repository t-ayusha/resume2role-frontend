import { useNavigate } from 'react-router-dom'

import { motion } from 'framer-motion'

import GlassCard from '../components/GlassCard'
import AppFooter from '../components/AppFooter'

import { DashboardLayout } from '../layout/DashboardLayout'

const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  transition: {
    duration: 0.5,
  },
}

const templates = [
  {
    id: 'frontend-tech',

    title:
      'Frontend Developer',

    description:
      'Practice React, JavaScript, TypeScript, UI architecture, APIs, and frontend system design.',

    role:
      'Frontend Developer',

    type: 'Technical',

    icon: '⚛️',
  },

  {
    id: 'backend-tech',

    title:
      'Backend Developer',

    description:
      'Prepare for Spring Boot, Node.js, databases, REST APIs, authentication, and backend scalability.',

    role:
      'Backend Developer',

    type: 'Technical',

    icon: '🛠️',
  },

  {
    id: 'fullstack-tech',

    title:
      'Full Stack Developer',

    description:
      'Combined frontend and backend interview preparation with system design fundamentals.',

    role:
      'Full Stack Developer',

    type: 'Technical',

    icon: '🚀',
  },

  {
    id: 'behavioral',

    title:
      'Behavioral Interview',

    description:
      'Improve communication, leadership, teamwork, conflict resolution, and HR interview skills.',

    role:
      'Software Engineer',

    type: 'Behavioral',

    icon: '🧠',
  },

  {
    id: 'product-manager',

    title:
      'Product Manager',

    description:
      'Practice product thinking, stakeholder communication, roadmap planning, and prioritization.',

    role:
      'Product Manager',

    type: 'Behavioral',

    icon: '📊',
  },

  {
    id: 'ai-resume',

    title:
      'AI Resume Interview',

    description:
      'Upload your resume and let AI generate highly personalized interview questions.',

    role:
      'Software Engineer',

    type: 'AI Resume',

    icon: '🤖',
  },
]

function TemplatesPage() {
  const navigate =
    useNavigate()

  const handleTemplateSelect =
    (template: {
      role: string
      type: string
    }) => {
      navigate(
        '/interview/setup',
        {
          state: {
            role:
              template.role,

            type:
              template.type,
          },
        }
      )
    }

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <motion.div
          {...fadeInUp}
        >
          <h1 className="text-3xl font-bold text-white/90">
            Interview
            Templates
          </h1>

          <p className="mt-2 text-white/60">
            Choose a
            curated interview
            template to
            quickly begin AI
            practice sessions.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map(
            (
              template,
              idx
            ) => (
              <motion.div
                key={
                  template.id
                }
                {...fadeInUp}
                transition={{
                  delay:
                    idx *
                    0.1,
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    handleTemplateSelect(
                      template
                    )
                  }
                  className="w-full text-left"
                >
                  <GlassCard className="group relative flex h-full flex-col p-8 transition-all hover:bg-white/10">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C7B8FF]/10 text-3xl transition-transform group-hover:scale-110">
                      {
                        template.icon
                      }
                    </div>

                    <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-[#C7B8FF]">
                      {
                        template.title
                      }
                    </h3>

                    <p className="mb-6 flex-grow text-sm leading-relaxed text-white/50">
                      {
                        template.description
                      }
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
                        {
                          template.type
                        }
                      </span>

                      <span className="text-sm font-bold text-[#C7B8FF] opacity-0 transition-opacity group-hover:opacity-100">
                        Use Template
                        →
                      </span>
                    </div>
                  </GlassCard>
                </button>
              </motion.div>
            )
          )}
        </div>

        <AppFooter />
      </section>
    </DashboardLayout>
  )
}

export default TemplatesPage