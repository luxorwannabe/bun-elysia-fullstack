import React, { useState } from 'react'
import { api } from '../../lib/api'
import { usePasswordStrength } from '../../hooks/usePasswordStrength'

interface PasswordChangeFormProps {
  onSuccess: (message: string) => void
}

export const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const { score, color, label } = usePasswordStrength(newPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const { error: apiError } = await api.user.password.put({ currentPassword, newPassword })
    
    setSaving(false)
    if (apiError) {
      const errVal = apiError.value as { error?: string }
      setError(errVal?.error || 'Failed to change password')
    } else {
      onSuccess('Password successfully updated!')
      setCurrentPassword('')
      setNewPassword('')
      setIsOpen(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setError('')
    setCurrentPassword('')
    setNewPassword('')
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-lg border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        Update Security Settings
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 animate-in slide-in-from-top-4 fade-in duration-300">
      <h3 className="text-lg font-bold text-white mb-4">Change Password</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-400 mb-1.5 ml-1">Current Password</label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-indigo-400 transition-colors focus:outline-none cursor-pointer"
            >
              {showCurrentPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-400 mb-1.5 ml-1">New Password</label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pr-12"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-indigo-400 transition-colors focus:outline-none cursor-pointer"
            >
              {showNewPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          {/* Password Strength Indicator */}
          {newPassword.length > 0 && (
            <div className="mt-2 text-right">
              <div className="flex gap-1 h-1 w-full rounded-full overflow-hidden mb-1">
                <div className={`h-full flex-1 transition-colors duration-300 ${score >= 1 ? color : 'bg-slate-700'}`}></div>
                <div className={`h-full flex-1 transition-colors duration-300 ${score >= 2 ? color : 'bg-slate-700'}`}></div>
                <div className={`h-full flex-1 transition-colors duration-300 ${score >= 3 ? color : 'bg-slate-700'}`}></div>
                <div className={`h-full flex-1 transition-colors duration-300 ${score >= 4 ? color : 'bg-slate-700'}`}></div>
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase">{label}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium animate-pulse">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || newPassword.length < 6}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:opacity-50 text-white font-bold rounded-lg transition-all enabled:cursor-pointer disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save New Password'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all enabled:cursor-pointer disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
