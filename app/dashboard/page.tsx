'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { DashboardHeader } from '@/components/dashboard-header'
import { SnippetCard } from '@/components/snippet-card'
import { SnippetDialog } from '@/components/snippet-dialog'
import { SnippetDetailPanel } from '@/components/snippet-detail-panel'
import { TagFilter } from '@/components/tag-filter'
import { SnippetWithTags, Tag, Language } from '@/lib/types'
import { Loader2, Code2 } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSnippet, setSelectedSnippet] = useState<SnippetWithTags | null>(null)
  const [editingSnippet, setEditingSnippet] = useState<SnippetWithTags | null>(null)

  const debouncedSearch = useDebounce(searchQuery, 300)

  const queryParams = new URLSearchParams()
  if (debouncedSearch) queryParams.set('search', debouncedSearch)
  if (selectedTagIds.length > 0) queryParams.set('tags', selectedTagIds.join(','))
  
  const { data, error, mutate, isLoading } = useSWR<{ snippets: SnippetWithTags[]; tags: Tag[] }>(
    `/api/snippets?${queryParams.toString()}`,
    fetcher,
    { refreshInterval: 0 }
  )

  const snippets = data?.snippets || []
  const tags = data?.tags || []

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const handleCreateTag = async (name: string) => {
    const res = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (res.ok) {
      mutate()
    }
  }

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

  return (
    <div className="min-h-svh bg-background">
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewSnippet={handleNewSnippet}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <TagFilter
              tags={tags}
              selectedTagIds={selectedTagIds}
              onTagToggle={handleTagToggle}
              onCreateTag={handleCreateTag}
            />
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive-foreground">Failed to load snippets</p>
              </div>
            ) : snippets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <Code2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No snippets yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {debouncedSearch || selectedTagIds.length > 0
                    ? 'No snippets match your filters'
                    : 'Create your first snippet to get started'}
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
          </main>
        </div>
      </div>

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
