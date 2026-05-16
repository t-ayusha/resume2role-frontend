function AppFooter() {

  return (
    <footer className="mt-auto w-full space-y-8 py-12 px-6">
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Logo & Moto */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">PrepWise</h2>
          <p className="max-w-md text-gray-400 text-sm leading-relaxed">
            PrepWise is an AI-powered mock interview platform where you will find great tools for 
            mastering technical interviews. Each session is designed to help you succeed 
            with real-time feedback and detailed insights.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium">
          {['Home', 'About', 'Contact', 'Blog', 'Articles'].map((link) => (
            <button key={link} className="text-gray-400 transition-colors hover:text-white">
              {link}
            </button>
          ))}
        </div>

        {/* Admin Section */}
        <div className="pt-4 border-t border-white/5 w-full flex flex-col items-center gap-4">
          <p className="text-xs text-gray-500">
            Design By - <span className="text-gray-400">PrepWise Team</span>
          </p>
        </div>
      </div>

    </footer>
  )
}

export default AppFooter

