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
import { SnippetWithTags, Tag, Language } from '@/lib/types'
import { Loader2, Search, Plus, Code2 } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSnippet, setSelectedSnippet] = useState<SnippetWithTags | null>(null)
  const [editingSnippet, setEditingSnippet] = useState<SnippetWithTags | null>(null)

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

  const handleSaveSnippet = useCallback(async (snippetData: {
    title: string
    description: string
    language: Language
    content: string
    commitMessage: string
    tagIds: string[]
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
      mutate()
      setEditingSnippet(null)
      if (selectedSnippet && editingSnippet?.id === selectedSnippet.id) {
        const updatedData = await res.json()
        setSelectedSnippet(updatedData.snippet)
      }
    }
  }, [editingSnippet, selectedSnippet, mutate])

  const handleDeleteSnippet = async (id: string) => {
    const res = await fetch(`/api/snippets/${id}`, { method: 'DELETE' })
    if (res.ok) {
      mutate()
      if (selectedSnippet?.id === id) {
        setSelectedSnippet(null)
      }
    }
  }

  const handleNewSnippet = () => {
    setEditingSnippet(null)
    setIsDialogOpen(true)
  }

  const handleEditSnippet = (snippet: SnippetWithTags) => {
    setEditingSnippet(snippet)
    setIsDialogOpen(true)
  }

  const snippetCount = snippets.length

  return (
    <div className="flex min-h-svh bg-background">
      {/* Sidebar */}
      <DashboardSidebar
        selectedLanguage={selectedLanguage}
        onLanguageSelect={setSelectedLanguage}
        onNewSnippet={handleNewSnippet}
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
            <Button
              onClick={handleNewSnippet}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Snippet
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-2xl pl-10 bg-input border-border"
            />
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
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive">Failed to load snippets</p>
            </div>
          ) : snippets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-3 text-muted-foreground/50">
                <Code2 className="h-12 w-12 mx-auto" strokeWidth={1} />
              </div>
              <p className="text-muted-foreground">
                {debouncedSearch || selectedLanguage
                  ? 'No snippets found'
                  : 'No snippets yet'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {snippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onClick={() => setSelectedSnippet(snippet)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Snippet Dialog */}
      <SnippetDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        snippet={editingSnippet}
        onSave={handleSaveSnippet}
        availableTags={tags}
      />

      {/* Snippet Detail Panel */}
      <SnippetDetailPanel
        snippet={selectedSnippet}
        onClose={() => setSelectedSnippet(null)}
        onEdit={() => selectedSnippet && handleEditSnippet(selectedSnippet)}
        onDelete={() => selectedSnippet && handleDeleteSnippet(selectedSnippet.id)}
      />
    </div>
  )
}
