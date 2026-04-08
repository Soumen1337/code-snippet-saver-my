'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CodeEditor } from './code-editor'
import { SnippetWithTags, Language, SUPPORTED_LANGUAGES, Tag } from '@/lib/types'
import { Loader2 } from 'lucide-react'

interface SnippetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  snippet?: SnippetWithTags | null
  onSave: (data: {
    title: string
    description: string
    language: Language
    content: string
    commitMessage: string
    tagIds: string[]
  }) => Promise<void>
  availableTags: Tag[]
}

export function SnippetDialog({
  open,
  onOpenChange,
  snippet,
  onSave,
  availableTags,
}: SnippetDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [language, setLanguage] = useState<Language>('javascript')
  const [content, setContent] = useState('')
  const [commitMessage, setCommitMessage] = useState('')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const isEditing = !!snippet

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title)
      setDescription(snippet.description || '')
      setLanguage(snippet.language as Language)
      setContent(snippet.current_content)
      setSelectedTagIds(snippet.tags.map(t => t.id))
      setCommitMessage('')
    } else {
      setTitle('')
      setDescription('')
      setLanguage('javascript')
      setContent('')
      setCommitMessage('')
      setSelectedTagIds([])
    }
  }, [snippet, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIsLoading(true)
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        language,
        content,
        commitMessage: commitMessage.trim() || (isEditing ? 'Updated snippet' : 'Initial version'),
        tagIds: selectedTagIds,
      })
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">
            {isEditing ? 'Edit Snippet' : 'Create New Snippet'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Make changes to your snippet and save a new version.' : 'Add a new code snippet to your collection.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My awesome snippet"
                required
                className="bg-input"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                <SelectTrigger className="bg-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this snippet do?"
              rows={2}
              className="bg-input resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Code</Label>
            <CodeEditor
              value={content}
              onChange={setContent}
              language={language}
              className="min-h-[300px]"
            />
          </div>

          {availableTags.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Button
                    key={tag.id}
                    type="button"
                    variant={selectedTagIds.includes(tag.id) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleTag(tag.id)}
                    className={selectedTagIds.includes(tag.id) ? 'bg-primary hover:bg-primary/90' : ''}
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {isEditing && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="commit">Version note</Label>
              <Input
                id="commit"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="What changed in this version?"
                className="bg-input"
              />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title.trim() || !content.trim()}
              className="gradient-bg hover:opacity-90 text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Snippet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
