'use client'

import { Sparkles, Send, Loader2, X, MessageSquare } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

type Message = { id: string, role: 'user' | 'assistant', content: string }

export function AiCoach() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.text || 'Failed to fetch response')
      }
      
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.text }])
    } catch (error: any) {
      console.error(error)
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: error.message || 'Sorry, I encountered an error. Check your API key!' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-105 transition-transform z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] flex flex-col border border-primary/20 bg-background/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-10">
          {/* Header */}
          <div className="bg-primary/10 border-b border-primary/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">AI Coach</h3>
                <p className="text-xs text-muted-foreground">Powered by Gemini</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-4">
                <Sparkles className="w-12 h-12 text-primary/30" />
                <p>I'm your AI Personal Operating System Coach.</p>
                <p className="text-sm">Ask me for a daily plan or how to prioritize your goals!</p>
              </div>
            ) : (
              messages.map(m => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${
                    m.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-secondary text-foreground rounded-tl-sm border border-border/50'
                  }`}>
                    {m.role === 'assistant' && (
                       <div className="prose prose-sm dark:prose-invert max-w-none">
                         <ReactMarkdown>{m.content}</ReactMarkdown>
                       </div>
                    )}
                    {m.role === 'user' && m.content}
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary p-3 rounded-2xl rounded-tl-sm border border-border/50 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Analyzing your OS...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border/50 bg-background/50">
            <form onSubmit={onSubmit} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message AI Coach..."
                className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-primary text-primary-foreground p-2 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
