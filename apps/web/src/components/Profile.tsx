import React, { useEffect, useState, useCallback, useRef } from 'react'
import { api } from '../lib/api'
import { ProfileAvatar } from './profile/ProfileAvatar'
import { ProfileNameEditor } from './profile/ProfileNameEditor'
import { ProfileEmailEditor } from './profile/ProfileEmailEditor'
import { PasswordChangeForm } from './profile/PasswordChangeForm'
import type { UserProfile } from '../types'

export const Profile: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  useEffect(() => {
    document.title = 'Profile | Bun Elysia Fullstack'
  }, [])
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [profileError, setProfileError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const hasLoadedOnce = useRef(false)

  const fetchProfile = useCallback(async () => {
    if (!hasLoadedOnce.current) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }
    const { data, error: apiError } = await api.user.profile.get()
    
    if (!apiError) {
      if (data) {
        setUser(data as UserProfile)
        hasLoadedOnce.current = true
        setLoading(false)
        setRefreshing(false)
        return
      }
    }

    if (apiError?.status === 401) {
      const { error: refreshError } = await api.auth.refresh.post()
      if (!refreshError) {
        const { data: retryData, error: retryError } = await api.user.profile.get()
        if (!retryError && retryData) {
          setUser(retryData as UserProfile)
          hasLoadedOnce.current = true
          setLoading(false)
          setRefreshing(false)
          return
        }
      }
    }
    
    onLogout()
    setLoading(false)
    setRefreshing(false)
  }, [onLogout])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleLogout = async () => {
    await api.auth.logout.post()
    onLogout()
  }

  const handlePasswordSuccess = (message: string) => {
    setPasswordSuccess(message)
    setTimeout(() => setPasswordSuccess(''), 5000)
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
    <div className="relative max-w-2xl w-full p-6 sm:p-8 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in zoom-in duration-500 overflow-hidden">
      
      {/* Refreshing overlay */}
      {refreshing && (
        <div className="absolute inset-0 z-20 bg-slate-800/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {passwordSuccess && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-4">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
          {passwordSuccess}
        </div>
      )}

      {profileError && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm font-bold flex items-center justify-between animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
            {profileError}
          </div>
          <button onClick={() => setProfileError('')} className="text-rose-400/50 hover:text-rose-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mt-4">
        <ProfileAvatar 
          user={user}
          onAvatarUpdate={(avatarUrl) => setUser(prev => prev ? { ...prev, avatarUrl } : null)}
          onError={setProfileError}
        />
        
        <div className="flex-1 w-full text-center md:text-left">
          <ProfileNameEditor 
            name={user.name}
            onNameUpdate={(name) => setUser(prev => prev ? { ...prev, name } : null)}
          />
          <ProfileEmailEditor 
            email={user.email}
            onEmailUpdate={(email) => setUser(prev => prev ? { ...prev, email } : null)}
          />
        </div>
      </div>

      {/* Change Password Section */}
      <div className="mt-8 pt-8 border-t border-slate-700/50">
        <PasswordChangeForm onSuccess={handlePasswordSuccess} />
      </div>

      <div className="mt-10 pt-8 border-t border-slate-700/50 flex justify-between items-center">
        <button
          onClick={fetchProfile}
          className="text-slate-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
        >
          Refresh Data
        </button>
        <button
          onClick={handleLogout}
          className="px-8 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-lg border border-red-500/20 transition-all duration-200 cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
