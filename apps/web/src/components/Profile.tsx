import React, { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'
import { ImageCropper } from './ImageCropper'
import { getCroppedImg } from '../lib/image'

interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface UserProfile {
  id: number
  email: string
  name: string
  avatarUrl?: string
  createdAt?: string
  storage: {
    provider: string
    isServerless: boolean
  }
}

export const Profile: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  useEffect(() => {
    document.title = 'Profile | Bun Elysia Fullstack'
  }, [])
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Name Edit State
  const [isEditingName, setIsEditingName] = useState(false)
  const [editNameValue, setEditNameValue] = useState('')
  const [savingName, setSavingName] = useState(false)

  // Email Edit State
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [editEmailValue, setEditEmailValue] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)

  // Password Change State
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  
  // Avatar State
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [hasImageError, setHasImageError] = useState(false)
  const [hasFallbackError, setHasFallbackError] = useState(false)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [tempImage, setTempImage] = useState<string | null>(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [tempRotation, setTempRotation] = useState(0)
  
  // Storage Warning State
  const [showVercelWarning, setShowVercelWarning] = useState(false)
  const [profileError, setProfileError] = useState('')

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    const { data, error: apiError } = await api.user.profile.get()
    
    if (!apiError) {
      if (data && typeof data !== 'string') {
        setUser(data as UserProfile)
        setHasImageError(false)
        setLoading(false)
        return
      }
    }

    if (apiError?.status === 401) {
      const { error: refreshError } = await api.auth.refresh.post()
      if (!refreshError) {
        const { data: retryData, error: retryError } = await api.user.profile.get()
        if (!retryError && retryData && typeof retryData !== 'string') {
          setUser(retryData as UserProfile)
          setLoading(false)
          return
        }
      }
    }
    
    onLogout()
    setLoading(false)
  }, [onLogout])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  useEffect(() => {
    if (user) {
      setIsImageLoading(true)
      setHasImageError(false)
      setHasFallbackError(false)
    }
  }, [user?.avatarUrl, user?.email])

  const handleLogout = async () => {
    await api.auth.logout.post()
    onLogout()
  }

  const handleUpdateName = async () => {
    if (!editNameValue.trim() || editNameValue === user?.name) {
      setIsEditingName(false)
      return
    }
    setSavingName(true)
    setProfileError('')
    const { data, error } = await api.user.profile.put({ name: editNameValue })
    setSavingName(false)
    if (!error && data) {
      setUser((prev) => prev ? { ...prev, name: data.name } : null)
      setIsEditingName(false)
    } else if (error) {
      const errVal = error.value as { error?: string }
      setProfileError(errVal?.error || 'Failed to update name')
    }
  }

  const handleUpdateEmail = async () => {
    if (!editEmailValue.trim() || editEmailValue === user?.email) {
      setIsEditingEmail(false)
      return
    }
    setSavingEmail(true)
    setProfileError('')
    const { data, error } = await api.user.profile.put({ email: editEmailValue })
    setSavingEmail(false)
    if (!error && data) {
      setUser((prev) => prev ? { ...prev, email: data.email } : null)
      setIsEditingEmail(false)
    } else if (error) {
      const errVal = error.value as { error?: string }
      setProfileError(errVal?.error || 'Email already in use or invalid')
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')
    setSavingPassword(true)

    const { error } = await api.user.password.put({ currentPassword, newPassword })
    
    setSavingPassword(false)
    if (error) {
      const errVal = error.value as { error?: string }
      setPasswordError(errVal?.error || 'Failed to change password')
    } else {
      setPasswordSuccess('Password successfully updated!')
      setCurrentPassword('')
      setNewPassword('')
      setIsChangingPassword(false)
      setTimeout(() => setPasswordSuccess(''), 5000)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Instead of uploading immediately, we open the cropper
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setTempImage(reader.result as string)
      setCropModalOpen(true)
    })
    reader.readAsDataURL(file)
    
    // Reset the input so the same file can be selected again
    e.target.value = ''
  }

  const handleCropComplete = (pixelCrop: Area, rotation: number) => {
    setCroppedAreaPixels(pixelCrop)
    setTempRotation(rotation)
  }

  const confirmCrop = async () => {
    if (!tempImage || !croppedAreaPixels) return

    setCropModalOpen(false)
    setIsUploadingAvatar(true)

    try {
      const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels, tempRotation)
      if (!croppedImage) throw new Error('Failed to crop image')

      // Convert Blob to File
      const file = new File([croppedImage], 'avatar.webp', { type: 'image/webp' })

      const { data, error } = await api.user.avatar.put({ file })
      
      if (!error && data) {
        setUser((prev) => prev ? { ...prev, avatarUrl: data.avatarUrl } : null)
        setHasImageError(false)
        
        // Show Vercel warning if applicable
        if (user?.storage.isServerless && user?.storage.provider === 'local') {
          setShowVercelWarning(true)
          setTimeout(() => setShowVercelWarning(false), 8000)
        }
      } else if (error) {
        const errVal = error.value as { error?: string }
        setProfileError(errVal?.error || 'Failed to upload profile picture')
      }
    } catch (err) {
      console.error(err)
      setProfileError('An unexpected error occurred during upload')
    } finally {
      setIsUploadingAvatar(false)
      setTempImage(null)
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  // Password Strength Logic
  const getPasswordStrength = () => {
    let score = 0
    if (newPassword.length > 5) score += 1
    if (newPassword.length > 8) score += 1
    if (/\d/.test(newPassword)) score += 1
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(newPassword)) score += 1
    return score
  }

  const strengthScore = getPasswordStrength()
  const getStrengthColor = () => {
    switch (strengthScore) {
      case 0: return 'bg-slate-700'
      case 1: return 'bg-red-500'
      case 2: return 'bg-orange-500'
      case 3: return 'bg-yellow-400'
      case 4: return 'bg-emerald-500'
      default: return 'bg-slate-700'
    }
  }

  const getStrengthLabel = () => {
    if (newPassword.length === 0) return ''
    switch (strengthScore) {
      case 1: return 'Weak'
      case 2: return 'Fair'
      case 3: return 'Good'
      case 4: return 'Strong'
      default: return ''
    }
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
      
      {/* Rest of Vercel Warning */}
      {showVercelWarning && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm font-medium flex items-center gap-3 animate-bounce">
          <div className="shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <p>
            <span className="font-bold">Developer Notice:</span> You are using Local Storage on Vercel. 
            Uploaded images are temporary and will be deleted automatically. 
            Switch to Cloudinary or S3 for production.
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mt-4">
        <div className="relative group">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarUpload} 
            className="hidden" 
            accept="image/*"
          />
          <div 
            onClick={triggerFileSelect}
            className={`w-40 h-40 rounded-2xl flex shrink-0 items-center justify-center text-5xl font-bold text-white shadow-lg shadow-indigo-500/20 cursor-pointer overflow-hidden transition-all hover:ring-4 hover:ring-indigo-500/50 ${user.avatarUrl ? 'bg-slate-700' : 'bg-linear-to-br from-indigo-500 to-purple-600'}`}
          >
            {isUploadingAvatar ? (
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                {isImageLoading && (
                  <div className={`absolute inset-0 z-10 flex items-center justify-center border-2 border-slate-600/50 rounded-2xl animate-pulse ${user.avatarUrl && !hasImageError ? 'bg-slate-700' : 'bg-linear-to-br from-indigo-500 to-purple-600'}`}>
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {!hasFallbackError ? (
                  <img 
                    src={(user.avatarUrl && !hasImageError) ? user.avatarUrl : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                    alt="" 
                    className={`w-full h-full object-cover rounded-2xl transition-opacity duration-500 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => {
                      if (user.avatarUrl && !hasImageError) {
                        setHasImageError(true)
                        setIsImageLoading(true)
                      } else {
                        setHasFallbackError(true)
                        setIsImageLoading(false)
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 rounded-2xl border-2 border-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                )}
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full text-center md:text-left">
          {/* Name Section */}
          <div className="mb-2 flex items-center justify-center md:justify-start min-h-[48px]">
            {isEditingName ? (
              <div className="flex flex-wrap items-center gap-2 w-full animate-in fade-in max-w-full">
                <input 
                  type="text" 
                  value={editNameValue}
                  onChange={(e) => setEditNameValue(e.target.value)}
                  disabled={savingName}
                  className="min-w-[200px] flex-1 px-3 py-2 bg-slate-900 border border-indigo-500 rounded-lg text-white font-bold text-2xl focus:outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleUpdateName}
                    disabled={savingName}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-lg text-sm transition-colors whitespace-nowrap enabled:cursor-pointer disabled:cursor-not-allowed"
                  >
                    {savingName ? '...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditingName(false)
                      setProfileError('')
                    }}
                    disabled={savingName}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-sm transition-colors whitespace-nowrap enabled:cursor-pointer disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 group max-w-full">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white wrap-break-word whitespace-normal leading-tight">{user.name}</h1>
                <button 
                  onClick={() => {
                    setEditNameValue(user.name)
                    setIsEditingName(true)
                  }}
                  className="p-2 bg-slate-700/50 lg:bg-slate-700/50 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-lg transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                  title="Edit Name"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                </button>
              </div>
            )}
          </div>
          {isEditingName && profileError && (
            <div className="mt-2 text-red-400 text-sm font-medium animate-pulse ml-1 text-center md:text-left">
              {profileError}
            </div>
          )}

          {/* Email Section */}
          <div className="flex items-center justify-center md:justify-start min-h-[32px]">
            {isEditingEmail ? (
              <div className="flex flex-wrap items-center gap-2 w-full animate-in fade-in max-w-full">
                <input 
                  type="email" 
                  value={editEmailValue}
                  onChange={(e) => setEditEmailValue(e.target.value)}
                  disabled={savingEmail}
                  className="min-w-[200px] flex-1 px-3 py-1.5 bg-slate-900 border border-indigo-500/50 rounded-lg text-indigo-400 font-medium text-sm focus:outline-none"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleUpdateEmail}
                    disabled={savingEmail}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-md text-[10px] uppercase transition-colors whitespace-nowrap enabled:cursor-pointer disabled:cursor-not-allowed"
                  >
                    {savingEmail ? '...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditingEmail(false)
                      setProfileError('')
                    }}
                    disabled={savingEmail}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-md text-[10px] uppercase transition-colors whitespace-nowrap enabled:cursor-pointer disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 group max-w-full">
                <p className="text-indigo-400 font-medium text-base sm:text-lg leading-none break-all sm:wrap-break-word whitespace-normal">{user.email}</p>
                <button 
                  onClick={() => {
                    setEditEmailValue(user.email)
                    setIsEditingEmail(true)
                  }}
                  className="p-1.5 bg-slate-700/30 lg:bg-slate-700/30 hover:bg-indigo-500/10 text-slate-500 hover:text-indigo-400 rounded-md transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                  title="Edit Email"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                </button>
              </div>
            )}
          </div>
          {isEditingEmail && profileError && (
            <div className="mt-2 text-red-400 text-sm font-medium animate-pulse ml-1 text-center md:text-left">
              {profileError}
            </div>
          )}
          
        </div>
      </div>

      {/* Change Password Section */}
      <div className="mt-8 pt-8 border-t border-slate-700/50">
        {!isChangingPassword ? (
          <button
            onClick={() => setIsChangingPassword(true)}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-lg border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Update Security Settings
          </button>
        ) : (
          <form onSubmit={handleChangePassword} className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 animate-in slide-in-from-top-4 fade-in duration-300">
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
                      <div className={`h-full flex-1 transition-colors duration-300 ${strengthScore >= 1 ? getStrengthColor() : 'bg-slate-700'}`}></div>
                      <div className={`h-full flex-1 transition-colors duration-300 ${strengthScore >= 2 ? getStrengthColor() : 'bg-slate-700'}`}></div>
                      <div className={`h-full flex-1 transition-colors duration-300 ${strengthScore >= 3 ? getStrengthColor() : 'bg-slate-700'}`}></div>
                      <div className={`h-full flex-1 transition-colors duration-300 ${strengthScore >= 4 ? getStrengthColor() : 'bg-slate-700'}`}></div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{getStrengthLabel()}</span>
                  </div>
                )}
              </div>

              {passwordError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium animate-pulse">
                  {passwordError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingPassword || newPassword.length < 6}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:opacity-50 text-white font-bold rounded-lg transition-all enabled:cursor-pointer disabled:cursor-not-allowed"
                >
                  {savingPassword ? 'Saving...' : 'Save New Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false)
                    setPasswordError('')
                    setCurrentPassword('')
                    setNewPassword('')
                  }}
                  disabled={savingPassword}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all enabled:cursor-pointer disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
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

      {cropModalOpen && tempImage && (
        <ImageCropper
          image={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setCropModalOpen(false)
            setTempImage(null)
          }}
          onConfirm={confirmCrop}
        />
      )}
    </div>
  )
}
