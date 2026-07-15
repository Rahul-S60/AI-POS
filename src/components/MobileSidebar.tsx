'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut, User } from 'lucide-react'
import { navigation } from '@/components/Sidebar'

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar when clicking a link
  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors md:hidden"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={closeSidebar}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-card border-r border-border shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 p-1 overflow-hidden">
              <img src="/logo.svg" alt="AI-POS Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-glow">AI-POS</span>
          </div>
          <button 
            onClick={closeSidebar}
            className="p-2 -mr-2 rounded-xl text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col px-4 py-6 overflow-y-auto">
          <ul role="list" className="flex flex-1 flex-col gap-y-2">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={closeSidebar}
                        className={`
                          group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium transition-all duration-200
                          ${isActive 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
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
            <li className="mt-auto pt-6">
              <ul role="list" className="-mx-2 space-y-1">
                <li>
                  <Link
                    href="/profile"
                    onClick={closeSidebar}
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
    </>
  )
}
