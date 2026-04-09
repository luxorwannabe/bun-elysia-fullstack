import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { api } from './lib/api'
import { Home } from './components/Home'
import { Login } from './components/Login'
import { Profile } from './components/Profile'
import { Register } from './components/Register'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await api.user.profile.get()
        
        if (!error && data && typeof data !== 'string') {
          setIsAuthenticated(true)
          return
        }

        // If Error, try to refresh
        if (error?.status === 401) {
          const { error: refreshError } = await api.auth.refresh.post()
          
          if (!refreshError) {
            const { data: retryData, error: retryError } = await api.user.profile.get()
            if (!retryError && retryData && typeof retryData !== 'string') {
              setIsAuthenticated(true)
              return
            }
          }
        }
        
        setIsAuthenticated(false)
      } catch {
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
    <div className="min-h-screen w-full bg-slate-950 text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-slate-900/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-900/50 blur-[120px]" />
      </div>
      
      <main className="relative z-10 w-full">
        <Routes>
          <Route 
            path="/" 
            element={<Home isAuthenticated={isAuthenticated} />} 
          />
          <Route 
            path="/login" 
            element={
              <div className="min-h-screen w-full flex items-center justify-center p-4">
                {isAuthenticated ? <Navigate to="/profile" replace /> : <Login onLogin={() => setIsAuthenticated(true)} />} 
              </div>
            } 
          />
          <Route 
            path="/register" 
            element={
              <div className="min-h-screen w-full flex items-center justify-center p-4">
                {isAuthenticated ? <Navigate to="/profile" replace /> : <Register onRegister={() => setIsAuthenticated(true)} />} 
              </div>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <div className="min-h-screen w-full flex items-center justify-center p-4">
                {isAuthenticated ? <Profile onLogout={() => setIsAuthenticated(false)} /> : <Navigate to="/login" replace />} 
              </div>
            } 
          />
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </main>
      
      <footer className="w-full py-12 text-center opacity-30 text-xs font-mono tracking-widest uppercase mt-auto">
        &copy; 2026 Luxor &bull; Licensed under MIT
      </footer>
    </div>
  )
}

export default App
