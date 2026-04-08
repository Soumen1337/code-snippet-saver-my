'use client'

import { Button } from '@/components/ui/button'
import { Language, QUICK_FILTER_LANGUAGES, SUPPORTED_LANGUAGES } from '@/lib/types'
import { cn } from '@/lib/utils'

interface LanguageFilterProps {
  selectedLanguage: Language | null
  onLanguageSelect: (language: Language | null) => void
}

export function LanguageFilter({
  selectedLanguage,
  onLanguageSelect,
}: LanguageFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onLanguageSelect(null)}
        className={cn(
          'h-7 px-3 text-xs font-medium rounded-full',
          selectedLanguage === null
            ? 'gradient-bg text-white border-transparent shadow-sm shadow-primary/30 hover:opacity-90'
            : 'glass border border-border/60 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all'
        )}
      >
        All
      </Button>
      {QUICK_FILTER_LANGUAGES.map((lang) => {
        const langInfo = SUPPORTED_LANGUAGES.find(l => l.value === lang)
        const isSelected = selectedLanguage === lang
        return (
          <Button
            key={lang}
            variant="outline"
            size="sm"
            onClick={() => onLanguageSelect(isSelected ? null : lang)}
            className={cn(
              'h-7 px-3 text-xs font-medium rounded-full',
              isSelected
                ? 'gradient-bg text-white border-transparent shadow-sm shadow-primary/30 hover:opacity-90'
                : 'glass border border-border/60 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all'
            )}
          >
            {langInfo?.label || lang}
          </Button>
        )
      })}
    </div>
  )
}
