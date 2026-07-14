'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Target, Activity, CheckSquare, BarChart, LogOut, BrainCircuit, ListChecks, Film, User } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Daily Top 10', href: '/daily-top-10', icon: ListChecks },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Habits', href: '/habits', icon: Activity },
  { name: 'Tracker', href: '/personal-tracker', icon: Film },
  { name: 'Analytics', href: '/analytics', icon: BarChart },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl">
      <div className="flex h-16 shrink-0 items-center px-6 gap-3 border-b border-border/50">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 p-1 overflow-hidden">
          <img src="/logo.svg" alt="AI-POS Logo" className="w-full h-full object-contain" />
        </div>
        <span className="font-semibold text-lg tracking-tight text-glow">AI-POS</span>
      </div>
      <nav className="flex flex-1 flex-col px-4 py-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium transition-all duration-200
                        ${isActive 
                          ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                        }
                      `}
                    >
                      <item.icon
                        className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
          <li className="mt-auto">
            <ul role="list" className="-mx-2 space-y-1">
              <li>
                <Link
                  href="/profile"
                  className={`group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium transition-all duration-200 ${
                    pathname === '/profile'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  <User
                    className={`h-5 w-5 shrink-0 ${
                      pathname === '/profile' ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                  />
                  Profile
                </Link>
              </li>
              <li>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="group flex w-full gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
                    Sign out
                  </button>
                </form>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )
}
