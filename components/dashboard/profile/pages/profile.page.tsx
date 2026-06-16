'use client'

import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { User, Loader2 } from 'lucide-react'
import { useProfileStore } from '../stores/profile.store'
import { ProfileAvatar } from '../views/profile-avatar'
import { ProfileForm } from '../views/profile-form'
import { DangerZone } from '../views/danger-zone'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const { isEditing, setIsEditing, isFetching, fetchProfile } = useProfileStore()

  useEffect(() => {
    fetchProfile(user, updateUser)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  return (
    <div className="min-h-screen bg-[#051424] p-8 space-y-10 font-['Manrope'] text-white">
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
          <ProfileAvatar />

          {isEditing ? (
            <ProfileForm />
          ) : (
            <DangerZone />
          )}
        </div>
      </Card>
    </div>
  )
}
