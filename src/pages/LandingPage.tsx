import { useNavigate } from 'react-router-dom'
import AppFooter from '../components/AppFooter'
import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'
import PageWrapper from '../layout/PageWrapper'
import { useAuth } from '../context/AuthContext'

function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin } = useAuth()

  const onStart = () => {
    if (isAuthenticated || isAdmin) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  return (
    <PageWrapper className="items-start" innerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <div className="w-full space-y-6">
        <nav className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
          <p className="text-2xl font-semibold tracking-wide text-[#C7B8FF]">PrepWise</p>
          <div className="flex items-center gap-3">
            
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2"
                >
                  Login
                </button>
                <PrimaryButton 
                  variant="primary" 
                  className="w-auto px-6 py-2 text-sm" 
                  onClick={() => navigate('/signup')}
                >
                  Signup
                </PrimaryButton>
              </>
            
          </div>
        </nav>

        <GlassCard className="text-center py-16">
          <h1 className="text-5xl font-bold md:text-6xl bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent leading-tight">
            Practice job interviews <br /> with AI confidence
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60 leading-relaxed">
            Master your next interview with PrepWise. Get real-time AI feedback, personalized coaching, and data-driven insights to land your dream job.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <PrimaryButton className="w-full sm:w-auto px-10 py-4 text-lg" onClick={onStart}>
              Get Started for Free
            </PrimaryButton>
            <button className="text-white/60 hover:text-white transition-colors text-sm font-medium">
              Watch Demo →
            </button>
          </div>
        </GlassCard>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { 
              step: '01', 
              title: 'AI Role Matching', 
              desc: 'Select from 50+ specialized roles. Our AI adapts its questions to match industry-standard requirements for your specific position.',
              icon: '🎯'
            },
            { 
              step: '02', 
              title: 'Live Simulation', 
              desc: 'Experience a realistic interview flow. Practice handling unexpected questions and maintain your composure under pressure.',
              icon: '🎥'
            },
            { 
              step: '03', 
              title: 'Deep Analytics', 
              desc: 'Receive a comprehensive breakdown of your performance, including tone analysis, technical accuracy, and areas for improvement.',
              icon: '📈'
            },
          ].map((item) => (
            <GlassCard key={item.step} className="group hover:bg-white/5 transition-colors duration-500">
              <div className="flex justify-between items-start mb-4">
                <span className="text-4xl">{item.icon}</span>
                <span className="text-xs font-bold text-[#C7B8FF]/40 group-hover:text-[#C7B8FF] transition-colors">{item.step}</span>
              </div>
              <h2 className="text-xl font-bold mb-2">{item.title}</h2>
              <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
            </GlassCard>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Confidence Boost', desc: 'Overcome interview anxiety with repeated practice in a safe environment.', icon: '🚀' },
            { title: 'Skill Gap Analysis', desc: 'Identify exactly which technical or soft skills you need to work on.', icon: '🔍' },
            { title: 'Industry Insights', desc: 'Get questions that are actually being asked in top tech companies today.', icon: '💡' },
            { title: 'Time Efficiency', desc: 'Prepare faster with targeted feedback instead of generic study guides.', icon: '⚡' },
          ].map((adv) => (
            <GlassCard key={adv.title} className="p-6 text-center group hover:bg-white/5 transition-all duration-300">
               <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">{adv.icon}</span>
               <h4 className="font-bold mb-2">{adv.title}</h4>
               <p className="text-xs text-white/50 leading-relaxed">{adv.desc}</p>
            </GlassCard>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <GlassCard className="flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Why choose PrepWise?</h3>
              <ul className="space-y-4">
                {[
                  'Real-time behavioral & technical feedback',
                  'Industry-specific question banks',
                  'Detailed scoring across 5+ dimensions',
                  'Unlimited practice sessions',
                  'AI-powered tone and sentiment analysis',
                  'Customized interview paths for 50+ roles'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <div className="h-5 w-5 rounded-full bg-[#C7B8FF]/20 flex items-center justify-center text-[#C7B8FF] text-[10px]">✓</div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="italic text-sm text-white/60">
                "PrepWise helped me structure my answers and improve my confidence in just a week. I felt completely prepared for my senior role interview."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-linear-to-br from-[#7A5CFF] to-[#C7B8FF]" />
                <div>
                  <p className="text-xs font-bold">Sarah Jenkins</p>
                  <p className="text-[10px] text-white/30">Frontend Lead @ TechFlow</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="relative overflow-hidden flex flex-col items-center justify-center text-center py-12">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(199,184,255,0.1),transparent_70%)] pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <h3 className="text-3xl font-bold">Ready to land your <br /> dream job?</h3>
              <p className="text-white/50 text-sm max-w-xs mx-auto">
                Join 5,000+ candidates who have improved their interview performance with our AI coach.
              </p>
              <p className="text-[10px] text-white/20 uppercase tracking-widest">No credit card required</p>
            </div>
          </GlassCard>
        </div>

        <AppFooter />
      </div>
    </PageWrapper>
  )
}

export default LandingPage
