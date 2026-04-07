import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'

interface UserProfile {
  id: number
  email: string
  name: string
  createdAt?: string
}

export const Profile: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    setLoading(true)
    const { data, error: apiError } = await (api.user.profile.get() as any)
    
    if (!apiError) {
      if (data && typeof data !== 'string') {
        setUser(data as UserProfile)
        setLoading(false)
        return
      }
    }

    // Handle Error (including 401)
    if (apiError?.status === 401) {
      console.log('🔄 Access Token expired, attempting silent refresh...')
      const { error: refreshError } = await (api.auth.refresh.post() as any)
      
      if (!refreshError) {
        console.log('✅ Refresh successful, retrying profile fetch...')
        const { data: retryData, error: retryError } = await (api.user.profile.get() as any)
        
        if (!retryError && retryData && typeof retryData !== 'string') {
          setUser(retryData as UserProfile)
          setLoading(false)
          return
        }
      }
    }
    
    // If we reach here, it's a real error or refresh failed
    console.log('❌ Auth failure, logging out')
    onLogout()
    setLoading(false)
  }


  useEffect(() => {
    fetchProfile()
  }, [])

  const handleLogout = async () => {
    await (api.auth.logout.post() as any)
    onLogout()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 animate-pulse">Fetching secure profile...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-2xl w-full p-8 bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-5xl font-bold text-white shadow-lg shadow-indigo-500/20">
          {user.name.charAt(0)}
        </div>

        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-white mb-2">{user.name}</h1>
          <p className="text-indigo-400 font-medium mb-4">{user.email}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">User ID</span>
              <span className="text-slate-200 font-mono">#{user.id}</span>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Status</span>
              <span className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-700/50 flex justify-between items-center">
        <button
          onClick={fetchProfile}
          className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          Refresh Data
        </button>
        <button
          onClick={handleLogout}
          className="px-8 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl border border-red-500/20 transition-all duration-200"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
