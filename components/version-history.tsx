'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SnippetVersion } from '@/lib/types'
import { GitCommit, Check } from 'lucide-react'
import { format } from 'date-fns'

interface VersionHistoryProps {
  versions: SnippetVersion[]
  selectedVersions: [SnippetVersion | null, SnippetVersion | null]
  onSelectVersion: (version: SnippetVersion) => void
  onClearSelection: () => void
}

export function VersionHistory({
  versions,
  selectedVersions,
  onSelectVersion,
  onClearSelection,
}: VersionHistoryProps) {
  const isSelected = (version: SnippetVersion) =>
    selectedVersions[0]?.id === version.id || selectedVersions[1]?.id === version.id

  const getSelectionOrder = (version: SnippetVersion) => {
    if (selectedVersions[0]?.id === version.id) return 1
    if (selectedVersions[1]?.id === version.id) return 2
    return null
  }

  if (versions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No version history yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {(selectedVersions[0] || selectedVersions[1]) && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
          <p className="text-sm text-muted-foreground">
            {selectedVersions[0] && selectedVersions[1]
              ? 'Two versions selected for comparison'
              : 'Select another version to compare'}
          </p>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            Clear
          </Button>
        </div>
      )}

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-4">
          {versions.map((version, index) => {
            const selected = isSelected(version)
            const selectionOrder = getSelectionOrder(version)

            return (
              <div
                key={version.id}
                className={`relative flex items-start gap-4 p-3 rounded-lg transition-colors cursor-pointer ${
                  selected
                    ? 'bg-emerald-500/10 border border-emerald-500/50'
                    : 'hover:bg-secondary'
                }`}
                onClick={() => onSelectVersion(version)}
              >
                {/* Timeline dot */}
                <div
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    selected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {selected ? (
                    <span className="text-xs font-bold">{selectionOrder}</span>
                  ) : (
                    <GitCommit className="h-4 w-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="shrink-0">
                      v{version.version_number}
                    </Badge>
                    {index === 0 && (
                      <Badge className="bg-emerald-600 text-white shrink-0">
                        Latest
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-card-foreground">
                    {version.commit_message || `Version ${version.version_number}`}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(version.created_at), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>

                {selected && (
                  <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
