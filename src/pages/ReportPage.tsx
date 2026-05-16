import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'
import ScoreBadge from '../components/ScoreBadge'

import {
  getInterviewResultApi,
} from '../lib/api'

import { useAuth } from '../context/AuthContext'

import PageWrapper from '../layout/PageWrapper'

type InterviewResult = {
  interviewId: string
  averageScore: number
  totalQuestions: number
  strengths: string[]
  weaknesses: string[]
  overallFeedback: string
}

function ReportPage() {
  const navigate = useNavigate()

  const [searchParams] =
    useSearchParams()

  const { user } = useAuth()

  const [loading, setLoading] =
    useState(true)

  const [report, setReport] =
    useState<InterviewResult | null>(
      null
    )

  useEffect(() => {
    const load =
      async () => {
        try {
          const id =
            searchParams.get('id')

          if (!id) {
            setLoading(false)
            return
          }

          const result =
            await getInterviewResultApi(
              id
            )

          setReport(result)
        } catch {
          setReport(null)
        } finally {
          setLoading(false)
        }
      }

    void load()
  }, [searchParams])

  const score =
    Math.round(
      report?.averageScore || 0
    )

  const verdict = useMemo(() => {
    if (score >= 8)
      return 'Excellent'

    if (score >= 6)
      return 'Good'

    if (score >= 4)
      return 'Average'

    return 'Needs Improvement'
  }, [score])

  const createdAt =
    new Date().toLocaleString()

  const accuracy = Math.min(
    100,
    Math.round(score * 10)
  )

  const avatarUrl =
    user?.avatarUrl ||
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'

  return (
    <PageWrapper innerClassName="items-center px-4 py-8 md:px-8">
      <GlassCard className="w-full max-w-4xl space-y-8 p-8 md:p-10">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold tracking-wide text-[#C7B8FF]">
            PrepWise
          </p>

          <img
            src={avatarUrl}
            alt="Profile"
            className="h-10 w-10 rounded-full border border-white/20 object-cover"
          />
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-gray-300">
              Loading report...
            </p>
          </div>
        ) : !report ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-5 text-center">
            <p className="text-lg text-gray-300">
              Report not found.
            </p>

            <PrimaryButton
              type="button"
              onClick={() =>
                navigate(
                  '/dashboard'
                )
              }
            >
              Back to Dashboard
            </PrimaryButton>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold md:text-3xl">
                AI Interview
                Evaluation Report
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                <span>
                  Overall Score:
                  {' '}
                  {score}/10
                </span>

                <span className="h-1 w-1 rounded-full bg-gray-500" />

                <span>
                  Accuracy:
                  {' '}
                  {accuracy}%
                </span>

                <span className="h-1 w-1 rounded-full bg-gray-500" />

                <span>
                  Questions:
                  {' '}
                  {
                    report.totalQuestions
                  }
                </span>

                <span className="h-1 w-1 rounded-full bg-gray-500" />

                <span>
                  {createdAt}
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            <div className="rounded-3xl border border-[#C7B8FF]/15 bg-[#C7B8FF]/5 p-6">
              <p className="text-lg leading-relaxed text-gray-100">
                {
                  report.overallFeedback
                }
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4 rounded-3xl border border-green-500/10 bg-green-500/5 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-500/10 p-3 text-green-400">
                    ✓
                  </div>

                  <h2 className="text-xl font-semibold text-green-300">
                    Strengths
                  </h2>
                </div>

                <ul className="space-y-3">
                  {report.strengths
                    .length > 0 ? (
                    report.strengths.map(
                      (
                        item
                      ) => (
                        <li
                          key={
                            item
                          }
                          className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-gray-200"
                        >
                          {item}
                        </li>
                      )
                    )
                  ) : (
                    <li className="text-sm text-gray-400">
                      No strengths
                      recorded.
                    </li>
                  )}
                </ul>
              </div>

              <div className="space-y-4 rounded-3xl border border-red-500/10 bg-red-500/5 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
                    !
                  </div>

                  <h2 className="text-xl font-semibold text-red-300">
                    Areas for
                    Improvement
                  </h2>
                </div>

                <ul className="space-y-3">
                  {report.weaknesses
                    .length > 0 ? (
                    report.weaknesses.map(
                      (
                        item
                      ) => (
                        <li
                          key={
                            item
                          }
                          className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-gray-200"
                        >
                          {item}
                        </li>
                      )
                    )
                  ) : (
                    <li className="text-sm text-gray-400">
                      No weaknesses
                      recorded.
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <p className="text-lg font-semibold">
                Final Verdict:
              </p>

              <ScoreBadge
                score={verdict}
              />
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <PrimaryButton
                variant="secondary"
                type="button"
                onClick={() =>
                  navigate(
                    '/dashboard'
                  )
                }
              >
                Back to Dashboard
              </PrimaryButton>

              <PrimaryButton
                type="button"
                onClick={() =>
                  navigate(
                    '/interview/setup'
                  )
                }
              >
                Retake Interview
              </PrimaryButton>
            </div>
          </>
        )}
      </GlassCard>
    </PageWrapper>
  )
}

export default ReportPage