import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { Save, Loader2 } from 'lucide-react'
import { useProfileStore } from '../stores/profile.store'

export function ProfileForm() {
  const { user, updateUser } = useAuth()
  const { formData, setFormData, isLoading, saveProfile, setIsEditing } = useProfileStore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await saveProfile(updateUser)
  }

  return (
    <form className="space-y-10" onSubmit={handleSave}>
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
          type="submit"
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
          type="button"
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
  )
}
