import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppFooter from '../components/AppFooter'
import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'
import { getSummaryApi } from '../lib/api'
import { DashboardLayout } from '../layout/DashboardLayout'
import { useAuth } from '../context/AuthContext'

function DashboardPage() {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [summary, setSummary] = useState({
    stats: {
      totalInterviews: 0,
      avgScore: '0/100',
      lastScore: '0/100',
      activeUsers: 0,
    },
    recent: [] as Array<{ id: string; role: string; type: string; score: string }>,
    performance: [20, 30, 10, 40, 35, 25, 45],
    users: [] as Array<{ name: string; email: string; avatar: string; topScore: number; domain: string }>,
  })

  const topScorers = summary.users?.length > 0 
    ? summary.users
        .sort((a, b) => b.topScore - a.topScore)
        .map((u, i) => ({
          rank: i + 1,
          name: u.name,
          score: u.topScore,
          domain: u.domain,
          avatar: u.avatar
        }))
    : []

  useEffect(() => {
    const run = async () => {
      try {
        const data = await getSummaryApi()
        setSummary(data)
      } catch {
        // keep fallback values when API is not reachable
      }
    }
    void run()
  }, [])

  if (isAdmin) {
    return (
      <DashboardLayout>
        <section className="space-y-6">
          <GlassCard className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-gray-300">Overview of candidate performance and rankings.</p>
            </div>
          </GlassCard>

          <GlassCard className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#C7B8FF]">Top Scorers</h2>
              <span className="text-xs font-bold uppercase tracking-widest text-white/30">Global Ranking</span>
            </div>
            
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest text-white/40">
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Domain</th>
                    <th className="px-6 py-4 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {topScorers.map((scorer) => (
                    <tr key={scorer.rank} className="group transition-colors hover:bg-white/5">
                      <td className="px-6 py-4">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          scorer.rank === 1 ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]' :
                          scorer.rank === 2 ? 'bg-slate-300 text-black' :
                          scorer.rank === 3 ? 'bg-amber-700 text-white' :
                          'bg-white/10 text-white'
                        }`}>
                          {scorer.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={scorer.avatar} alt="" className="h-8 w-8 rounded-full border border-white/20" />
                          <span className="font-medium text-white">{scorer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-white/5 px-3 py-1 text-xs text-white/60">
                          {scorer.domain}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-bold text-[#C7B8FF]">{scorer.score}/100</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <div className="grid gap-6 sm:grid-cols-2">
            <GlassCard className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Stats</h3>
              <div className="grid gap-4">
                <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                  <span className="text-sm text-white/60">Active Users Today</span>
                  <span className="text-xl font-bold">{summary.stats.activeUsers}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                  <span className="text-sm text-white/60">Total Interviews Conducted</span>
                  <span className="text-xl font-bold">{summary.stats.totalInterviews}</span>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard className="space-y-4">
              <h3 className="text-lg font-semibold">Domain Distribution</h3>
              <div className="space-y-3">
                {summary.users?.length > 0 ? (
                  Array.from(new Set(summary.users.map(u => u.domain))).map((domain) => {
                    const count = summary.users.filter(u => u.domain === domain).length
                    const percent = Math.round((count / summary.users.length) * 100)
                    return (
                      <div key={domain} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">{domain}</span>
                          <span className="text-[#C7B8FF] font-bold">{percent}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full bg-[#C7B8FF]" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-xs text-white/30">No domain data available.</p>
                )}
              </div>
            </GlassCard>
          </div>

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
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="text-sm text-gray-300">Track your interview practice and progress.</p>
          </div>
          <PrimaryButton className="w-auto px-6" onClick={() => navigate('/interview/setup')}>
            Start Interview
          </PrimaryButton>
        </GlassCard>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { label: 'Total Interviews', value: String(summary.stats.totalInterviews).padStart(2, '0') },
            { label: 'Avg Score', value: summary.stats.avgScore },
            { label: 'Last Score', value: summary.stats.lastScore },
          ].map((card) => (
            <GlassCard key={card.label} className="space-y-2 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">{card.label}</p>
              <p className="text-3xl font-semibold text-white">{card.value}</p>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Interviews</h2>
          <div className="space-y-3">
            {summary.recent.length > 0 ? (
              summary.recent.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/interview/report?id=${item.id}`)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left transition hover:bg-white/10"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-white">{item.role}</p>
                    <p className="text-xs text-white/40">{item.type}</p>
                  </div>
                  <span className="text-sm font-bold text-[#C7B8FF]">{item.score}</span>
                </button>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-white/30">No recent interviews found.</p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="space-y-6">
          <h2 className="text-xl font-semibold">Performance Overview</h2>
          <div className="flex h-48 items-end gap-3 px-2">
            {summary.performance.map((v, i) => (
              <div key={i} className="group relative flex-1">
                <div 
                  className="w-full rounded-t-xl bg-linear-to-t from-[#7A5CFF]/20 to-[#C7B8FF] transition-all duration-300 group-hover:to-[#D9D1FF]" 
                  style={{ height: `${v + 40}px` }} 
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-white/10 px-2 py-1 text-[10px] opacity-0 transition-opacity group-hover:opacity-100">
                  {v}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-2 text-[10px] font-bold uppercase tracking-wider text-white/30">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </GlassCard>

        <AppFooter />
      </section>
    </DashboardLayout>
  )
}

export default DashboardPage
