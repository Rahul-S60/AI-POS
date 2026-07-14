import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { User, ShieldAlert, Activity, Settings } from 'lucide-react'
import DeleteAccountButton from '@/components/DeleteAccountButton'
import { ThemeToggle } from '@/components/ThemeToggle'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch counts
  const { count: goalsCount } = await supabase.from('goals').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
  const { count: habitsCount } = await supabase.from('habits').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
  const { count: completedTasksCount } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'completed')

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account and data.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 glass-card rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-background shadow-xl mb-4 relative">
            <User className="w-10 h-10 text-primary" />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-background rounded-full" />
          </div>
          <h2 className="text-xl font-bold mb-1 truncate w-full px-4" title={user.email}>{user.email}</h2>
          <p className="text-sm text-muted-foreground mb-6">Member since {new Date(user.created_at).toLocaleDateString()}</p>
          <div className="w-full flex flex-col gap-2">
            <div className="bg-secondary/50 rounded-lg p-3 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Account Status</span>
              <span className="text-sm font-semibold text-green-500">Active</span>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Subscription</span>
              <span className="text-sm font-semibold text-primary">Free Tier</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Your Activity
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-background rounded-xl p-4 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Total Goals</p>
                <p className="text-3xl font-bold text-glow">{goalsCount || 0}</p>
              </div>
              <div className="bg-background rounded-xl p-4 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Active Habits</p>
                <p className="text-3xl font-bold text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">{habitsCount || 0}</p>
              </div>
              <div className="bg-background rounded-xl p-4 border border-border col-span-2 md:col-span-1">
                <p className="text-sm text-muted-foreground mb-1">Tasks Completed</p>
                <p className="text-3xl font-bold text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">{completedTasksCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive daily summaries and AI coach insights.</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer opacity-50 cursor-not-allowed">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                <div>
                  <h4 className="font-medium">Dark Mode</h4>
                  <p className="text-sm text-muted-foreground">Toggle application theme appearance.</p>
                </div>
                <ThemeToggle />
              </div>
              <p className="text-xs text-muted-foreground italic">* Preferences coming in a future update.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2 text-red-500">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Danger Zone</h3>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="space-y-1">
            <h4 className="font-semibold text-red-500">Delete Account & Data</h4>
            <p className="text-sm text-red-400/80">
              Permanently delete your account and all associated data (goals, habits, tasks, tracker items). This action cannot be undone.
            </p>
          </div>
          
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  )
}
