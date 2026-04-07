import { useState, useEffect } from 'react'
import { api } from './lib/api'
import { Login } from './components/Login'
import { Profile } from './components/Profile'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await (api.user.profile.get() as any)
        
        if (!error && data && typeof data !== 'string') {
          setIsAuthenticated(true)
          return
        }

        // If Error, try to refresh
        if (error?.status === 401) {
          const { error: refreshError } = await (api.auth.refresh.post() as any)
          
          if (!refreshError) {
            const { data: retryData, error: retryError } = await (api.user.profile.get() as any)
            if (!retryError && retryData && typeof retryData !== 'string') {
              setIsAuthenticated(true)
              return
            }
          }
        }
        
        setIsAuthenticated(false)
      } catch (err) {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])




  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-950 text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>
      
      <main className="relative z-10 w-full flex justify-center p-4 max-w-4xl">
        {isAuthenticated ? (
          <Profile onLogout={() => setIsAuthenticated(false)} />
        ) : (
          <Login onLogin={() => setIsAuthenticated(true)} />
        )}
      </main>
      
      <footer className="fixed bottom-8 left-0 right-0 text-center opacity-30 text-xs font-mono tracking-widest pointer-events-none uppercase">
        Bun + Elysia + Drizzle + React + Eden
      </footer>
    </div>
  )
}

export default App
