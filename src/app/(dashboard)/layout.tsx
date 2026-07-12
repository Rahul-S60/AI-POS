import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Background decorations for dashboard */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-[250px] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-border/50 bg-background/50 backdrop-blur-md px-6 justify-between">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            {/* User Profile */}
            <div className="flex items-center gap-3 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/50">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium border border-primary/20 overflow-hidden">
                {data.user.user_metadata?.avatar_url ? (
                   <img src={data.user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  data.user.email?.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-sm font-medium text-foreground pr-2 hidden md:block">
                {data.user.user_metadata?.full_name || data.user.email?.split('@')[0]}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
