import React, { useState } from 'react'
import { api } from '../../lib/api'

interface ProfileNameEditorProps {
  name: string
  onNameUpdate: (name: string) => void
}

export const ProfileNameEditor: React.FC<ProfileNameEditorProps> = ({ name, onNameUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!editValue.trim() || editValue === name) {
      setIsEditing(false)
      return
    }
    setSaving(true)
    setError('')
    const { data, error: apiError } = await api.user.profile.put({ name: editValue })
    setSaving(false)
    if (!apiError && data) {
      onNameUpdate(data.name)
      setIsEditing(false)
    } else if (apiError) {
      const errVal = apiError.value as { error?: string }
      setError(errVal?.error || 'Failed to update name')
    }
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-center md:justify-start min-h-[48px]">
        {isEditing ? (
          <div className="flex flex-wrap items-center gap-2 w-full animate-in fade-in max-w-full">
            <input 
              type="text" 
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              disabled={saving}
              className="min-w-[200px] flex-1 px-3 py-2 bg-slate-900 border border-indigo-500 rounded-lg text-white font-bold text-2xl focus:outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-lg text-sm transition-colors whitespace-nowrap enabled:cursor-pointer disabled:cursor-not-allowed"
              >
                {saving ? '...' : 'Save'}
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false)
                  setError('')
                }}
                disabled={saving}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-sm transition-colors whitespace-nowrap enabled:cursor-pointer disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 group max-w-full">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white wrap-break-word whitespace-normal leading-tight">{name}</h1>
            <button 
              onClick={() => {
                setEditValue(name)
                setIsEditing(true)
              }}
              className="p-2 bg-slate-700/50 lg:bg-slate-700/50 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-lg transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 cursor-pointer"
              title="Edit Name"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
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
