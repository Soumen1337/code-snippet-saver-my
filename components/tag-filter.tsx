'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tag, Plus, X } from 'lucide-react'
import { Tag as TagType } from '@/lib/types'

interface TagFilterProps {
  tags: TagType[]
  selectedTagIds: string[]
  onTagToggle: (tagId: string) => void
  onCreateTag: (name: string) => void
}

export function TagFilter({
  tags,
  selectedTagIds,
  onTagToggle,
  onCreateTag,
}: TagFilterProps) {
  const [newTagName, setNewTagName] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      onCreateTag(newTagName.trim())
      setNewTagName('')
      setIsAdding(false)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
          <Tag className="h-4 w-4" />
          <span>Tags</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
        </Button>
      </div>

      {isAdding && (
        <div className="flex gap-2 mb-3">
          <Input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Tag name"
            className="h-8 text-sm bg-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleCreateTag()
              }
            }}
          />
          <Button
            size="sm"
            onClick={handleCreateTag}
            disabled={!newTagName.trim()}
            className="h-8 bg-emerald-600 hover:bg-emerald-700"
          >
            Add
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {tags.length === 0 ? (
          <p className="text-xs text-muted-foreground">No tags yet</p>
        ) : (
          tags.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTagIds.includes(tag.id) ? 'default' : 'outline'}
              className={`cursor-pointer transition-colors ${
                selectedTagIds.includes(tag.id)
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'hover:bg-secondary'
              }`}
              onClick={() => onTagToggle(tag.id)}
            >
              {tag.name}
            </Badge>
          ))
        )}
      </div>
    </div>
  )
}
