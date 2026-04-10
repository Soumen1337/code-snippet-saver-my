'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { LanguageFilter } from '@/components/language-filter'
import { SnippetCard } from '@/components/snippet-card'
import { SnippetDialog } from '@/components/snippet-dialog'
import { SnippetDetailPanel } from '@/components/snippet-detail-panel'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SnippetWithTags, Tag, Language, Collection } from '@/lib/types'
import { CommandPalette } from '@/components/command-palette'
import { Search, Plus, Code2, Command } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from '@/hooks/use-debounce'
import { toast } from 'sonner'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSnippet, setSelectedSnippet] = useState<SnippetWithTags | null>(null)
  const [editingSnippet, setEditingSnippet] = useState<SnippetWithTags | null>(null)
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)
  const [cmdOpen, setCmdOpen] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 300)

  const queryParams = new URLSearchParams()
  if (debouncedSearch) queryParams.set('search', debouncedSearch)
  if (selectedTagIds.length > 0) queryParams.set('tags', selectedTagIds.join(','))
  if (selectedLanguage) queryParams.set('language', selectedLanguage)
  
  const { data, error, mutate, isLoading } = useSWR<{ snippets: SnippetWithTags[]; tags: Tag[] }>(
    `/api/snippets?${queryParams.toString()}`,
    fetcher,
    { refreshInterval: 0 }
  )

  const snippets = data?.snippets || []
  const tags = data?.tags || []

  const { data: collectionsData, mutate: mutateCollections } = useSWR<{ collections: Collection[] }>(
    '/api/collections', fetcher
  )
  const collections = collectionsData?.collections || []

  const filteredSnippets = selectedCollectionId
    ? snippets.filter(s => s.collection_id === selectedCollectionId)
    : snippets

  const handleSaveSnippet = useCallback(async (snippetData: {
    title: string
    description: string
    language: Language
    content: string
    commitMessage: string
    tagIds: string[]
    collectionId: string | null
  }) => {
    const url = editingSnippet
      ? `/api/snippets/${editingSnippet.id}`
      : '/api/snippets'
    
    const res = await fetch(url, {
      method: editingSnippet ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snippetData),
    })

    if (res.ok) {
      const updatedData = await res.json()
      toast.success(editingSnippet ? 'Snippet updated!' : 'Snippet created!')
      await mutate()
      setEditingSnippet(null)
      if (selectedSnippet && editingSnippet?.id === selectedSnippet.id) {
        setSelectedSnippet(updatedData.snippet)
      }
    } else {
      toast.error('Failed to save snippet. Please try again.')
    }
  }, [editingSnippet, selectedSnippet, mutate])

  const handleDeleteSnippet = async (id: string) => {
    const res = await fetch(`/api/snippets/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Snippet deleted')
      mutate()
      if (selectedSnippet?.id === id) {
        setSelectedSnippet(null)
      }
    } else {
      toast.error('Failed to delete snippet.')
    }
  }

  const handlePinSnippet = async (id: string, pinned: boolean) => {
    const res = await fetch(`/api/snippets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_pinned: pinned }),
    })
    if (res.ok) { mutate() } else { toast.error('Failed to update pin') }
  }

  const handleNewSnippet = () => {
    setEditingSnippet(null)
    setIsDialogOpen(true)
  }

  const handleEditSnippet = (snippet: SnippetWithTags) => {
    setEditingSnippet(snippet)
    setIsDialogOpen(true)
  }

  const snippetCount = filteredSnippets.length

  return (
    <div className="flex min-h-svh bg-background">
      {/* Sidebar */}
      <DashboardSidebar
        selectedLanguage={selectedLanguage}
        onLanguageSelect={(lang) => { setSelectedLanguage(lang); setSelectedCollectionId(null) }}
        onNewSnippet={handleNewSnippet}
        collections={collections}
        selectedCollectionId={selectedCollectionId}
        onCollectionSelect={(id) => { setSelectedCollectionId(id); setSelectedLanguage(null) }}
        onCollectionCreated={() => mutateCollections()}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">My Snippets</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {snippetCount} {snippetCount === 1 ? 'snippet' : 'snippets'} saved
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCmdOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                title="Open command palette (Ctrl+K)"
              >
                <Command className="h-3 w-3" />
                <span>K</span>
              </button>
              <Button
                onClick={handleNewSnippet}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Snippet
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-5 max-w-2xl">
            <div className="glass rounded-lg">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 bg-input/50 backdrop-blur-sm border-border focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Language Filter Chips */}
          <div className="mb-6">
            <LanguageFilter
              selectedLanguage={selectedLanguage}
              onLanguageSelect={setSelectedLanguage}
            />
          </div>

          {/* Snippets Grid */}
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass rounded-xl p-4 space-y-3 border border-white/10">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-32 w-full rounded-md" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive">Failed to load snippets</p>
            </div>
          ) : filteredSnippets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-3 text-muted-foreground/50">
                <Code2 className="h-12 w-12 mx-auto" strokeWidth={1} />
              </div>
              <p className="text-muted-foreground">
                {debouncedSearch || selectedLanguage || selectedCollectionId
                  ? 'No snippets found'
                  : 'No snippets yet'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredSnippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onClick={() => setSelectedSnippet(snippet)}
                  onPin={handlePinSnippet}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <SnippetDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        snippet={editingSnippet}
        onSave={handleSaveSnippet}
        availableTags={tags}
        availableCollections={collections}
      />

      <SnippetDetailPanel
        snippet={selectedSnippet}
        onClose={() => setSelectedSnippet(null)}
        onEdit={() => selectedSnippet && handleEditSnippet(selectedSnippet)}
        onDelete={() => selectedSnippet && handleDeleteSnippet(selectedSnippet.id)}
        onShareToggle={(updated) => {
          setSelectedSnippet(prev => prev ? { ...prev, is_public: updated.is_public, share_slug: updated.share_slug } : prev)
          mutate()
        }}
      />

      <CommandPalette
        snippets={snippets}
        onSelectSnippet={setSelectedSnippet}
        onNewSnippet={handleNewSnippet}
        open={cmdOpen}
        onOpenChange={setCmdOpen}
      />
    </div>
  )
}
