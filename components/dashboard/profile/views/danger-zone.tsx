import { ShieldAlert } from 'lucide-react'

export function DangerZone() {
  return (
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
  )
}
