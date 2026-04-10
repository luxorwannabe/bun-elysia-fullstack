import React, { useState } from 'react'
import { api } from '../../lib/api'

interface ProfileEmailEditorProps {
  email: string
  onEmailUpdate: (email: string) => void
}

export const ProfileEmailEditor: React.FC<ProfileEmailEditorProps> = ({ email, onEmailUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!editValue.trim() || editValue === email) {
      setIsEditing(false)
      return
    }
    setSaving(true)
    setError('')
    const { data, error: apiError } = await api.user.profile.put({ email: editValue })
    setSaving(false)
    if (!apiError && data) {
      onEmailUpdate(data.email)
      setIsEditing(false)
    } else if (apiError) {
      const errVal = apiError.value as { error?: string }
      setError(errVal?.error || 'Email already in use or invalid')
    }
  }

  return (
    <>
      <div className="flex items-center justify-center md:justify-start min-h-[32px]">
        {isEditing ? (
          <div className="flex flex-wrap items-center gap-2 w-full animate-in fade-in max-w-full">
            <input 
              type="email" 
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              disabled={saving}
              className="min-w-[200px] flex-1 px-3 py-1.5 bg-slate-900 border border-indigo-500/50 rounded-lg text-indigo-400 font-medium text-sm focus:outline-none"
            />
            <div className="flex gap-2">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-md text-[10px] uppercase transition-colors whitespace-nowrap enabled:cursor-pointer disabled:cursor-not-allowed"
              >
                {saving ? '...' : 'Save'}
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false)
                  setError('')
                }}
                disabled={saving}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-md text-[10px] uppercase transition-colors whitespace-nowrap enabled:cursor-pointer disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 group max-w-full">
            <p className="text-indigo-400 font-medium text-base sm:text-lg leading-none break-all sm:wrap-break-word whitespace-normal">{email}</p>
            <button 
              onClick={() => {
                setEditValue(email)
                setIsEditing(true)
              }}
              className="p-1.5 bg-slate-700/30 lg:bg-slate-700/30 hover:bg-indigo-500/10 text-slate-500 hover:text-indigo-400 rounded-md transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 cursor-pointer"
              title="Edit Email"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
            </button>
          </div>
        )}
      </div>
      {isEditing && error && (
        <div className="mt-2 text-red-400 text-sm font-medium animate-pulse ml-1 text-center md:text-left">
          {error}
        </div>
      )}
    </>
  )
}
