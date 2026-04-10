import React, { useState, useRef, useCallback } from 'react'
import { api } from '../../lib/api'
import { getCroppedImg } from '../../lib/image'
import { ImageCropper } from '../ImageCropper'
import type { Area, UserProfile } from '../../types'

interface ProfileAvatarProps {
  user: UserProfile
  onAvatarUpdate: (avatarUrl: string) => void
  onError: (message: string) => void
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ user, onAvatarUpdate, onError }) => {
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [hasImageError, setHasImageError] = useState(false)
  const [hasFallbackError, setHasFallbackError] = useState(false)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [tempImage, setTempImage] = useState<string | null>(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [tempRotation, setTempRotation] = useState(0)
  const [showVercelWarning, setShowVercelWarning] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  // Handle cached images: if img is already complete when mounted, mark as loaded
  const handleImgRef = useCallback((node: HTMLImageElement | null) => {
    imgRef.current = node
    if (node?.complete && node.naturalWidth > 0) {
      setIsImageLoading(false)
    }
  }, [])

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setTempImage(reader.result as string)
      setCropModalOpen(true)
    })
    reader.readAsDataURL(file)
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

      const file = new File([croppedImage], 'avatar.webp', { type: 'image/webp' })
      const { data, error } = await api.user.avatar.put({ file })

      if (!error && data) {
        onAvatarUpdate(data.avatarUrl)
        setHasImageError(false)

        if (user.storage.isServerless && user.storage.provider === 'local') {
          setShowVercelWarning(true)
          setTimeout(() => setShowVercelWarning(false), 8000)
        }
      } else if (error) {
        const errVal = error.value as { error?: string }
        onError(errVal?.error || 'Failed to upload profile picture')
      }
    } catch (err) {
      console.error(err)
      onError('An unexpected error occurred during upload')
    } finally {
      setIsUploadingAvatar(false)
      setTempImage(null)
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
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
                  ref={handleImgRef}
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
    </>
  )
}
