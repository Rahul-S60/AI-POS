'use client'

import { useState, useEffect } from 'react'
import { Download, Share, PlusSquare, X } from 'lucide-react'

export function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSModal, setShowIOSModal] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true)
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(isIosDevice)

    // Listen for native install prompt (Android/Desktop)
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true)
      return
    }

    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
      }
    } else {
      // Fallback if prompt isn't available (e.g. they dismissed it previously or browser doesn't support it)
      alert('To install the app, look for the "Install" icon in your browser address bar or menu.')
    }
  }

  // If already installed, don't show the button
  if (isStandalone) return null

  return (
    <>
      <button 
        onClick={handleInstallClick}
        className="inline-flex items-center justify-center gap-2 bg-secondary/50 backdrop-blur-md border border-border px-8 py-4 rounded-full text-lg font-semibold hover:bg-secondary/80 transition-all"
      >
        <Download className="w-5 h-5" />
        Download App
      </button>

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-3xl p-8 max-w-md w-full relative animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
            <button 
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary/50 text-muted-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <img src="/logo.svg" alt="AI-POS Logo" className="w-10 h-10 object-contain" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Install AI-POS</h3>
              <p className="text-muted-foreground">Install this app on your iPhone or iPad for the best experience.</p>
            </div>

            <div className="space-y-4 bg-secondary/30 p-6 rounded-2xl border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0 border border-border shadow-sm">
                  <Share className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-sm font-medium">1. Tap the <span className="font-bold text-blue-500">Share</span> button at the bottom of your screen.</p>
              </div>
              
              <div className="w-0.5 h-6 bg-border ml-5" />
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0 border border-border shadow-sm">
                  <PlusSquare className="w-5 h-5 text-foreground" />
                </div>
                <p className="text-sm font-medium">2. Scroll down and tap <span className="font-bold">Add to Home Screen</span>.</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowIOSModal(false)}
              className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}
