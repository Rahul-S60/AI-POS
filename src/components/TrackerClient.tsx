'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, PlayCircle, CheckCircle2, Circle, Star, Trash2, Edit, Clapperboard, Tv, Book, Search, X, MessageSquare, Check, AlignLeft } from 'lucide-react'
import { createTrackerItem, updateTrackerStatus, deleteTrackerItem, updateTrackerNotes } from '@/app/actions/tracker'

type TrackerItem = {
  id: string
  title: string
  category: string
  status: 'not_started' | 'ongoing' | 'completed'
  rating: number | null
  progress: string | null
  notes: string | null
}

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category.toLowerCase()) {
    case 'movie': return <Clapperboard className="w-5 h-5 text-orange-500" />
    case 'tv':
    case 'tv series': return <Tv className="w-5 h-5 text-blue-500" />
    case 'anime': return <Star className="w-5 h-5 text-purple-500" />
    case 'book': return <Book className="w-5 h-5 text-green-500" />
    default: return <Circle className="w-5 h-5" />
  }
}

const BASE_CATEGORIES = ['movie', 'tv', 'anime', 'book']

export function TrackerClient({ initialItems }: { initialItems: TrackerItem[] }) {
  const [items, setItems] = useState(initialItems)
  const [localCategories, setLocalCategories] = useState<string[]>([])
  const [hiddenCategories, setHiddenCategories] = useState<string[]>([])

  // Load custom and hidden categories from localStorage on mount
  useEffect(() => {
    const savedCustom = localStorage.getItem('ai_pos_custom_categories')
    if (savedCustom) {
      try { setLocalCategories(JSON.parse(savedCustom)) } catch (e) {}
    }
    const savedHidden = localStorage.getItem('ai_pos_hidden_categories')
    if (savedHidden) {
      try { setHiddenCategories(JSON.parse(savedHidden)) } catch (e) {}
    }
  }, [])

  // Combine base, db, and local categories, excluding hidden ones
  const categories = useMemo(() => {
    const dbCats = items.map(i => i.category.toLowerCase())
    const combined = Array.from(new Set([...BASE_CATEGORIES, ...dbCats, ...localCategories]))
    return combined.filter(c => !hiddenCategories.includes(c)).sort()
  }, [items, localCategories, hiddenCategories])
  
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || 'movie')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
  
  // Add Item Form State
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('movie')
  const [status, setStatus] = useState<'not_started' | 'ongoing' | 'completed'>('ongoing')

  // Remarks Form State
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null)
  const [tempNotes, setTempNotes] = useState('')

  // Add Category Form State
  const [newCategoryName, setNewCategoryName] = useState('')

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanCat = newCategoryName.trim().toLowerCase()
    if (!cleanCat) return

    // If it was hidden, unhide it
    if (hiddenCategories.includes(cleanCat)) {
      const updatedHidden = hiddenCategories.filter(c => c !== cleanCat)
      setHiddenCategories(updatedHidden)
      localStorage.setItem('ai_pos_hidden_categories', JSON.stringify(updatedHidden))
    }

    const updated = Array.from(new Set([...localCategories, cleanCat]))
    setLocalCategories(updated)
    localStorage.setItem('ai_pos_custom_categories', JSON.stringify(updated))
    
    setNewCategoryName('')
    setIsAddCategoryModalOpen(false)
    setActiveCategory(cleanCat)
    setCategory(cleanCat) // pre-select it in the add item form too
  }

  const handleHideCategory = (e: React.MouseEvent, catToHide: string) => {
    e.stopPropagation()
    const confirmHide = confirm(`Remove "${catToHide}" from categories?`)
    if (!confirmHide) return

    const updatedHidden = Array.from(new Set([...hiddenCategories, catToHide]))
    setHiddenCategories(updatedHidden)
    localStorage.setItem('ai_pos_hidden_categories', JSON.stringify(updatedHidden))

    if (activeCategory === catToHide) {
      const remaining = categories.filter(c => c !== catToHide)
      setActiveCategory(remaining[0] || 'movie')
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const formData = new FormData()
    formData.append('title', title)
    formData.append('category', category)
    formData.append('status', status)

    // Optimistic UI
    const tempId = Date.now().toString()
    setItems([...items, { id: tempId, title, category, status, rating: null, progress: null, notes: null }])
    setIsAddModalOpen(false)
    setTitle('')
    
    // Automatically switch to the newly created category
    setActiveCategory(category.toLowerCase())
    
    await createTrackerItem(formData)
    window.location.reload()
  }

  const handleUpdateStatus = async (id: string, newStatus: 'not_started' | 'ongoing' | 'completed') => {
    setItems(items.map(i => i.id === id ? { ...i, status: newStatus } : i))
    await updateTrackerStatus(id, newStatus)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tracked item?')) return
    setItems(items.filter(i => i.id !== id))
    await deleteTrackerItem(id)
  }

  const handleSaveNotes = async (id: string) => {
    // Optimistic UI update
    setItems(items.map(i => i.id === id ? { ...i, notes: tempNotes.trim() } : i))
    setEditingNotesId(null)
    await updateTrackerNotes(id, tempNotes.trim())
  }

  // Filter items by active category
  const activeItems = items.filter(i => i.category.toLowerCase() === activeCategory)
  
  const ongoingItems = activeItems.filter(i => i.status === 'ongoing')
  const notStartedItems = activeItems.filter(i => i.status === 'not_started')
  const completedItems = activeItems.filter(i => i.status === 'completed')

  const renderItemCard = (item: TrackerItem) => (
    <div key={item.id} className="glass-card p-6 rounded-3xl hover:bg-secondary/40 transition-colors group border border-border/50 hover:border-primary/30 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-secondary rounded-2xl border border-border/50">
            <CategoryIcon category={item.category} />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
             <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-red-500 p-2">
               <Trash2 className="w-4 h-4" />
             </button>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-4 line-clamp-2" title={item.title}>{item.title}</h3>
        
        {/* Remarks Section */}
        <div className="mb-6">
          {editingNotesId === item.id ? (
            <div className="space-y-2">
              <textarea 
                autoFocus
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder="Add your remarks..."
                className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary resize-none h-24"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditingNotesId(null)} className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleSaveNotes(item.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center gap-1">
                  <Check className="w-3 h-3" /> Save
                </button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => { setEditingNotesId(item.id); setTempNotes(item.notes || '') }}
              className="group/notes cursor-pointer"
            >
              {item.notes ? (
                <div className="p-3 bg-secondary/30 rounded-xl border border-transparent group-hover/notes:border-border/50 transition-colors relative">
                  <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">{item.notes}</p>
                  <Edit className="w-3 h-3 text-muted-foreground absolute top-3 right-3 opacity-0 group-hover/notes:opacity-100 transition-opacity" />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                  <AlignLeft className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Add Remarks</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <select
          value={item.status}
          onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
          className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors border appearance-none text-center cursor-pointer ${
            item.status === 'not_started' ? 'bg-secondary/50 border-border/50 text-muted-foreground hover:bg-secondary/70' :
            item.status === 'ongoing' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500 hover:bg-blue-500/20' :
            'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20'
          }`}
        >
          <option value="not_started">Backlog (Not Started)</option>
          <option value="ongoing">Currently Enjoying</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personal Tracker</h1>
          <p className="text-muted-foreground">Keep track of your downtime and entertainment.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full hover:opacity-90 transition-opacity flex items-center gap-2 font-medium shadow-lg shadow-primary/20 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(cat => (
          <div 
            key={cat}
            className={`flex items-center rounded-xl transition-all border ${
              activeCategory === cat 
                ? 'bg-primary/20 border-primary/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                : 'bg-secondary/50 border-transparent hover:border-border'
            }`}
          >
            <button 
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 font-medium capitalize transition-colors rounded-l-xl ${
                activeCategory === cat ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
            <button
              onClick={(e) => handleHideCategory(e, cat)}
              className={`pr-3 pl-1 py-2 transition-colors rounded-r-xl ${
                activeCategory === cat ? 'text-primary/70 hover:text-primary' : 'text-muted-foreground/50 hover:text-red-400'
              }`}
              title="Remove Category"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <button 
          onClick={() => setIsAddCategoryModalOpen(true)}
          className="px-4 py-2 rounded-xl font-medium text-muted-foreground hover:text-foreground hover:bg-secondary border border-dashed border-border/50 flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      {/* Items Area */}
      {items.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <Search className="w-16 h-16 text-muted-foreground/30 mb-6" />
          <h3 className="text-2xl font-bold mb-2">No items found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            You don't have any tracker items yet. Click 'Add Item' to start tracking.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {ongoingItems.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                <PlayCircle className="w-5 h-5" /> Currently Enjoying
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoingItems.map(renderItemCard)}
              </div>
            </div>
          )}

          {notStartedItems.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-muted-foreground flex items-center gap-2">
                <Circle className="w-5 h-5" /> Backlog
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notStartedItems.map(renderItemCard)}
              </div>
            </div>
          )}

          {completedItems.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-green-500 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Completed
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedItems.map(renderItemCard)}
              </div>
            </div>
          )}

          {activeItems.length === 0 && items.length > 0 && (
            <div className="text-center p-12 text-muted-foreground">
              No items found for this category.
            </div>
          )}
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card p-8 rounded-3xl w-full max-w-sm relative animate-in slide-in-from-bottom-10">
            <button onClick={() => setIsAddCategoryModalOpen(false)} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-6">New Category</h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Category Name</label>
                <input required autoFocus value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="e.g. Podcast" className="w-full bg-secondary/50 border border-border rounded-xl p-3 focus:outline-none focus:border-primary transition-colors" />
              </div>
              <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity mt-2">
                Add Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card p-8 rounded-3xl w-full max-w-md relative animate-in slide-in-from-bottom-10">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-6">Add New Item</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-secondary/50 border border-border rounded-xl p-3 focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                <select 
                  required 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  className="w-full bg-secondary/50 border border-border rounded-xl p-3 focus:outline-none focus:border-primary transition-colors appearance-none capitalize"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full bg-secondary/50 border border-border rounded-xl p-3 focus:outline-none focus:border-primary transition-colors appearance-none">
                  <option value="not_started">Backlog (Not Started)</option>
                  <option value="ongoing">Currently Enjoying (Ongoing)</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:opacity-90 transition-opacity mt-4">
                Save Tracker Item
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
