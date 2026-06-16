'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { Save, User, Camera, ShieldAlert, Upload, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { profileApi } from '@/lib/api' 

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true) // Add loading state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  })

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsFetching(true)
      try {
        console.log('Fetching profile...')
        const response = await profileApi.getProfile()
        console.log('Profile response:', response)
        
        if (response && response.responseCode === 200 && response.result) {
          const userData = response.result
          setFormData({
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || '',
          })
          // Update user in context if needed
          if (updateUser) {
            updateUser(userData)
          }
        } else {
          console.error('Failed to fetch profile:', response?.message || 'Unknown error')
          // If API fails, use user from context as fallback
          if (user) {
            setFormData({
              first_name: user.first_name || '',
              last_name: user.last_name || '',
              email: user.email || '',
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        // Use user from context as fallback
        if (user) {
          setFormData({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
          })
        }
        toast.error('Could not load profile data')
      } finally {
        setIsFetching(false)
      }
    }

    fetchProfile()
  }, [])

  // If still loading, show loading state
  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#051424] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="text-indigo-300/60 font-semibold">Loading profile...</p>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  // Save profile changes
  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await profileApi.updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
      })

      if (response && response.responseCode === 200) {
        toast.success('Profile updated successfully!')
        setIsEditing(false)
        
        if (updateUser && response.result) {
          updateUser(response.result)
        }
      } else {
        toast.error(response?.message || 'Failed to update profile')
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB.')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setAvatarUrl(e.target?.result as string)
      toast.success('Profile picture updated!')
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processImageFile(file)
    e.target.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processImageFile(file)
  }

  const initials = (formData.first_name?.charAt(0) || 'U') + (formData.last_name?.charAt(0) || 'U')

  return (
    <div className="min-h-screen bg-[#051424] p-8 space-y-10 font-['Manrope'] text-white">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Account Settings</h1>
          <p className="text-indigo-200/60 font-semibold text-sm">
            Manage your personal information, preferences, and security.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-black shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] transition-all active:scale-95"
          >
            Edit Profile
          </button>
        )}
      </div>

      <Card className="bg-[#1e1b4b] border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <User size={120} />
        </div>

        <div className="p-10">
          <div className="flex flex-col md:flex-row items-center gap-10 mb-12 pb-12 border-b border-white/5">
            <div
              className={`relative group transition-all duration-200 ${isDragging ? 'scale-105' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div
                className={`w-32 h-32 rounded-[2.5rem] border-4 overflow-hidden shadow-2xl transition-all duration-200 cursor-pointer
                  ${isDragging
                    ? 'border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.5)]'
                    : 'border-white/10 group-hover:border-indigo-400/40'
                  }`}
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center">
                    {isDragging ? (
                      <Upload size={32} className="text-white animate-bounce" />
                    ) : (
                      <span className="text-4xl font-black text-white">{initials}</span>
                    )}
                  </div>
                )}

                <div className="absolute inset-0 bg-black/50 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <Camera size={22} className="text-white" />
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Change</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-3 bg-white text-[#1e1b4b] rounded-2xl shadow-xl hover:scale-110 transition-transform active:scale-95 z-10"
                title="Upload photo"
              >
                <Camera size={18} />
              </button>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black text-white mb-1">
                {formData.first_name || 'User'} {formData.last_name || ''}
              </h2>
              <p className="text-indigo-300/60 font-bold tracking-wide uppercase text-xs">{formData.email || 'No email'}</p>
              <div className="mt-4 flex items-center gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                  Active Account
                </span>
              </div>
              <p className="mt-3 text-[10px] text-indigo-300/30 font-semibold">
                Click avatar or drag & drop an image · Max 5MB
              </p>
            </div>
          </div>

          {isEditing ? (
            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <Label htmlFor="first_name" className="text-xs font-black uppercase tracking-widest text-indigo-300">
                    First Name
                  </Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="bg-white/5 border-white/10 rounded-2xl h-14 px-6 focus:ring-indigo-500 text-white font-semibold"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="last_name" className="text-xs font-black uppercase tracking-widest text-indigo-300">
                    Last Name
                  </Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="bg-white/5 border-white/10 rounded-2xl h-14 px-6 focus:ring-indigo-500 text-white font-semibold"
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-indigo-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white/5 border-white/10 rounded-2xl h-14 px-6 focus:ring-indigo-500 text-white font-semibold"
                    disabled
                  />
                  <p className="text-xs text-indigo-300/30">Email cannot be changed here. Contact support for changes.</p>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-black shadow-xl transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Update Profile
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      first_name: user?.first_name || '',
                      last_name: user?.last_name || '',
                      email: user?.email || '',
                    })
                  }}
                  className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-2xl text-sm font-bold transition-all active:scale-95"
                >
                  Discard Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-red-500/5 border border-red-500/20 rounded-3xl p-8">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-red-500/10 rounded-[2rem] text-red-500 border border-red-500/20">
                  <ShieldAlert size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-red-400 mb-1">Danger Zone</h3>
                  <p className="text-red-400/50 text-sm font-medium">
                    Irreversibly delete your account and all associated financial data.
                  </p>
                </div>
              </div>
              <button 
                onClick={async () => {
                  if (confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
                    // Call delete API here
                  }
                }}
                className="w-full md:w-auto px-10 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl text-sm font-black transition-all active:scale-95"
              >
                Terminate Account
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}