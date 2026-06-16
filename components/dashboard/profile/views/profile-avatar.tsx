import { useRef } from 'react'
import { Camera, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { useProfileStore } from '../stores/profile.store'

export function ProfileAvatar() {
  const { avatarUrl, setAvatarUrl, isDragging, setIsDragging, formData } = useProfileStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
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
                  <span className="text-4xl font-black text-white">{initials.toUpperCase()}</span>
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
    </>
  )
}
