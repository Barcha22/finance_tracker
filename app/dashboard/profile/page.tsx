'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { Save, User, Camera, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Premium Profile Settings Component
 * 
 * Coherent with "Indigo Financial" Dark Theme:
 * - High Contrast: White/Indigo text on #051424 background.
 * - Structured Layout: Organized sections with consistent card styling.
 * - Interactive: Refined form states and tactile action buttons.
 */
export default function Profile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSave = () => {
    toast.success('Profile updated successfully!')
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-[#051424] p-8 space-y-10 font-['Manrope'] text-white">
      {/* --- Header Section --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">
            Account Settings
          </h1>
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

      {/* --- Profile Card --- */}
      <Card className="bg-[#1e1b4b] border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
           <User size={120} />
        </div>

        <div className="p-10">
          <div className="flex flex-col md:flex-row items-center gap-10 mb-12 pb-12 border-b border-white/5">
            <div className="relative group">
              <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 w-32 h-32 rounded-[2.5rem] flex items-center justify-center border-4 border-white/10 shadow-2xl overflow-hidden">
                <span className="text-4xl font-black text-white">{(formData.first_name?.charAt(0) || 'U') + (formData.last_name?.charAt(0) || 'U')}</span>
              </div>
              <button className="absolute -bottom-2 -right-2 p-3 bg-white text-[#1e1b4b] rounded-2xl shadow-xl hover:scale-110 transition-transform active:scale-95">
                <Camera size={18} />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black text-white mb-1">{formData.first_name} {formData.last_name}</h2>
              <p className="text-indigo-300/60 font-bold tracking-wide uppercase text-xs">{formData.email}</p>
              <div className="mt-4 flex items-center gap-2 justify-center md:justify-start">
                 <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Active Account</span>
              </div>
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
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleSave}
                  className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-black shadow-xl transition-all active:scale-95 flex items-center gap-2"
                >
                  <Save size={18} />
                  Update Profile
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-2xl text-sm font-bold transition-all active:scale-95"
                >
                  Discard Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'First Name', value: formData.first_name },
                { label: 'Last Name', value: formData.last_name },
                { label: 'Email Address', value: formData.email }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/2 border border-white/5 p-6 rounded-3xl group hover:bg-white/5 transition-colors">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">{item.label}</p>
                  <p className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* --- Danger Zone --- */}
      <Card className="bg-red-500/5 border border-red-500/20 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
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
          <button className="w-full md:w-auto px-10 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl text-sm font-black transition-all active:scale-95">
            Terminate Account
          </button>
        </div>
      </Card>
    </div>
  )
}
