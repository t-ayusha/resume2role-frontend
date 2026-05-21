import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom'

import AppFooter from '../components/AppFooter'
import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'

import { useAuth } from '../context/AuthContext'

import {
  getInterviewResultApi,
  getUserInterviewsApi,
} from '../lib/api'

import { DashboardLayout } from '../layout/DashboardLayout'

type RecentInterview = {
  id: string
  role: string
  type: string
  score: number
  status: string
  createdAt: string
}

function DashboardPage() {
  const navigate = useNavigate()

  const {
    isAdmin,
    user,
    logout,
  } = useAuth()

  const [loading, setLoading] =
    useState(true)

  const [recentInterviews, setRecentInterviews] =
    useState<
      RecentInterview[]
    >([])

  const [averageScore, setAverageScore] =
    useState(0)

  const [lastScore, setLastScore] =
    useState(0)

  useEffect(() => {
    const loadDashboard =
      async () => {
        if (!user?.email) {
          setLoading(false)
          return
        }

        try {
          const interviews =
            await getUserInterviewsApi(
              user.email
            )

          const enriched =
            await Promise.all(
              interviews.map(
                async (
                  item
                ) => {
                  try {
                    const result =
                      await getInterviewResultApi(
                        item.id
                      )

                    return {
                      id: item.id,

                      role:
                        item.role ||
                        'AI Interview',

                      type:
                        item.type ||
                        'Technical',

                      status:
                        item.status ||
                        'COMPLETED',

                      createdAt:
                        item.createdAt ||
                        new Date().toISOString(),

                      score:
                        Math.round(
                          result.averageScore *
                            10
                        ),
                    }
                  } catch {
                    return {
                      id: item.id,

                      role:
                        item.role ||
                        'AI Interview',

                      type:
                        item.type ||
                        'Technical',

                      status:
                        item.status ||
                        'COMPLETED',

                      createdAt:
                        item.createdAt ||
                        new Date().toISOString(),

                      score: 0,
                    }
                  }
                }
              )
            )

          setRecentInterviews(
            enriched
          )

          if (
            enriched.length > 0
          ) {
            const total =
              enriched.reduce(
                (
                  acc,
                  item
                ) =>
                  acc +
                  item.score,
                0
              )

            setAverageScore(
              Math.round(
                total /
                  enriched.length
              )
            )

            setLastScore(
              enriched[0].score
            )
          }
        } catch {
          setRecentInterviews(
            []
          )
        } finally {
          setLoading(false)
        }
      }

    void loadDashboard()
  }, [user])

  const performanceData =
    useMemo(() => {
      if (
        recentInterviews.length ===
        0
      ) {
        return [
          20,
          35,
          40,
          25,
          50,
          45,
          60,
        ]
      }

      return recentInterviews
        .slice(0, 7)
        .map(
          (i) => i.score
        )
    }, [recentInterviews])

  if (isAdmin) {
    return (
      <DashboardLayout>
        <section className="space-y-6">
          <GlassCard className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">
                Admin Dashboard
              </h1>

              <p className="text-sm text-[color:var(--text-secondary)]">
                Administrative
                access panel.
              </p>
            </div>

            <button
              onClick={() => {
                logout()

                navigate(
                  '/login'
                )
              }}
              className="rounded-full border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
            >
              Sign Out
            </button>
          </GlassCard>

          <GlassCard className="p-10 text-center">
            <h2 className="text-2xl font-semibold">
              Admin analytics
              integration pending
            </h2>

            <p className="mt-3 text-sm text-[color:var(--text-secondary)]">
              User dashboard
              integration is now
              fully backend
              powered.
            </p>
          </GlassCard>

          <AppFooter />
        </section>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <GlassCard className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">
              Dashboard
            </h1>

            <p className="text-sm text-[color:var(--text-secondary)]">
              Welcome back
              {user?.name
                ? `, ${user.name}`
                : ''}
              . Track your
              interview practice
              and AI evaluation
              progress.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <PrimaryButton
              className="w-auto px-6"
              onClick={() =>
                navigate(
                  '/interview/setup'
                )
              }
            >
              Start Interview
            </PrimaryButton>

            <button
              onClick={() => {
                logout()

                navigate(
                  '/login'
                )
              }}
              className="rounded-full border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
            >
              Sign Out
            </button>
          </div>
        </GlassCard>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              label:
                'Total Interviews',

              value: String(
                recentInterviews.length
              ).padStart(
                2,
                '0'
              ),
            },

            {
              label:
                'Average Score',

              value: `${averageScore}/100`,
            },

            {
              label:
                'Latest Score',

              value: `${lastScore}/100`,
            },
          ].map((card) => (
            <GlassCard
              key={
                card.label
              }
              className="space-y-2 p-6"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--text-muted)]">
                {card.label}
              </p>

              <p className="text-3xl font-semibold text-[color:var(--text-primary)]">
                {card.value}
              </p>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Recent Interviews
            </h2>

            {loading && (
              <span className="text-xs text-[color:var(--text-muted)]">
                Loading...
              </span>
            )}
          </div>

          <div className="space-y-3">
            {!loading &&
            recentInterviews.length >
              0 ? (
              recentInterviews.map(
                (item) => (
                  <button
                    key={
                      item.id
                    }
                    onClick={() =>
                      navigate(
                        `/interview/report?id=${item.id}`
                      )
                    }
                    className="flex w-full items-center justify-between rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] px-5 py-4 text-left transition hover:bg-[var(--card-hover)]"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-[color:var(--text-primary)]">
                        {
                          item.role
                        }
                      </p>

                      <p className="text-xs text-[color:var(--text-muted)]">
                        {
                          item.type
                        }
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-[#C7B8FF]/20 bg-[#C7B8FF]/10 px-3 py-1 text-xs text-[#7C3AED]">
                        {
                          item.status
                        }
                      </span>

                      <span className="text-sm font-bold text-[#7C3AED]">
                        {
                          item.score
                        }
                        /100
                      </span>
                    </div>
                  </button>
                )
              )
            ) : (
              <p className="py-4 text-center text-sm text-[color:var(--text-muted)]">
                {loading
                  ? 'Loading interviews...'
                  : 'No interviews found yet.'}
              </p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="space-y-6">
          <h2 className="text-xl font-semibold">
            Performance
            Overview
          </h2>

          <div className="flex h-48 items-end gap-3 px-2">
            {performanceData.map(
              (v, i) => (
                <div
                  key={i}
                  className="group relative flex-1"
                >
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-[#7A5CFF]/20 to-[#C7B8FF] transition-all duration-300 group-hover:to-[#D9D1FF]"
                    style={{
                      height: `${v + 40}px`,
                    }}
                  />

                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-[var(--card-bg)] px-2 py-1 text-[10px] text-[color:var(--text-primary)] opacity-0 transition-opacity group-hover:opacity-100">
                    {v}%
                  </div>
                </div>
              )
            )}
          </div>

          <div className="flex justify-between px-2 text-[10px] font-bold uppercase tracking-wider text-[color:var(--text-muted)]">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
          </div>
        </GlassCard>

        <AppFooter />
      </section>
    </DashboardLayout>
  )
}

export default DashboardPage