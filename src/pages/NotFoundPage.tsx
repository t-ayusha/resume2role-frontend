import { useNavigate } from 'react-router-dom'
import PageWrapper from '../layout/PageWrapper'
import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <PageWrapper innerClassName="flex items-center justify-center px-4 py-8">
      <GlassCard className="max-w-md w-full text-center space-y-4 py-16">
        <p className="text-7xl font-black text-[#C7B8FF]">404</p>
        <h1 className="text-2xl font-semibold text-white">Page not found</h1>
        <p className="text-sm text-white/50">The page you're looking for doesn't exist or has been moved.</p>
        <div className="pt-4">
          <PrimaryButton onClick={() => navigate('/')} className="w-auto px-8">Go Home</PrimaryButton>
        </div>
      </GlassCard>
    </PageWrapper>
  )
}
