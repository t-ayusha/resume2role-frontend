import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'
import ScoreBadge from '../components/ScoreBadge'
import { interviewMeta } from '../data/mockInterview'
import { getLatestReportApi, getReportByIdApi, type InterviewReport } from '../lib/api'

type EnhancedReport = InterviewReport & { accuracy?: number }
import PageWrapper from '../layout/PageWrapper'

function ReportPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [stateReport] = useState<EnhancedReport | null>(() => {
    const state = window.history.state as { usr?: { report?: EnhancedReport } } | null
    return state?.usr?.report ?? null
  })
  const [report, setReport] = useState<EnhancedReport | null>(stateReport)

  useEffect(() => {
    const run = async () => {
      try {
        const id = searchParams.get('id')
        const data = id ? await getReportByIdApi(id) : await getLatestReportApi()
        setReport(data)
      } catch {
        setReport(null)
      }
    }
    void run()
  }, [searchParams])

  const heading = report
    ? `Feedback on the Interview - ${report.role} Interview`
    : 'Feedback on the Interview - Frontend Developer Interview'
  const score = report ? `${report.score}/100` : '0/100'
  const createdAt = report ? new Date(report.createdAt).toLocaleString() : new Date().toLocaleString()
  const impression =
    report?.overallImpression ?? 'No report found yet. Complete an interview to view detailed feedback.'
  const breakdown = report?.breakdown ?? []
  const verdict = report?.verdict ?? 'Pending'
  const accuracy = report?.accuracy ?? 0

  return (
    <PageWrapper innerClassName="items-center px-4 py-8 md:px-8">
      <GlassCard className="w-full max-w-4xl space-y-6 p-8 md:p-10">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold tracking-wide text-[#C7B8FF]">PrepWise</p>
          <img
            src={interviewMeta.userAvatar}
            alt="Profile"
            className="h-10 w-10 rounded-full border border-white/20 object-cover"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold md:text-3xl">{heading}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
            <span>Overall Impression: {score}</span>
            <span className="h-1 w-1 rounded-full bg-gray-500" />
            <span>Accuracy: {accuracy}%</span>
            <span className="h-1 w-1 rounded-full bg-gray-500" />
            <span>{createdAt}</span>
          </div>
        </div>

        <div className="h-px w-full bg-white/10" />

        <p className="text-gray-200">{impression}</p>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Breakdown of Evaluation:</h2>
          {breakdown.map((item) => (
            <div key={item.title} className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold">
                {item.title} ({item.score})
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-300">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-lg font-semibold">Final Verdict:</p>
          <ScoreBadge score={verdict} />
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <PrimaryButton variant="secondary" type="button" onClick={() => navigate('/dashboard')}>
            Back to dashboard
          </PrimaryButton>
          <PrimaryButton variant="secondary" type="button">
            Replay Answers
          </PrimaryButton>
          <PrimaryButton type="button" onClick={() => navigate('/interview/setup')}>
            Retake interview
          </PrimaryButton>
        </div>
      </GlassCard>
    </PageWrapper>
  )
}

export default ReportPage
