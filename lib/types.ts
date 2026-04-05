export interface Snippet {
  id: string
  user_id: string
  title: string
  description: string | null
  language: string
  current_content: string
  created_at: string
  updated_at: string
}

export interface SnippetVersion {
  id: string
  snippet_id: string
  version_number: number
  content: string
  commit_message: string | null
  created_at: string
}

export interface Tag {
  id: string
  user_id: string
  name: string
}

export interface SnippetTag {
  snippet_id: string
  tag_id: string
}

export interface SnippetWithTags extends Snippet {
  tags: Tag[]
}

export type Language = 
  | 'javascript'
  | 'typescript'
  | 'html'
  | 'css'
  | 'json'
  | 'markdown'
  | 'text'

export const SUPPORTED_LANGUAGES: { value: Language; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'text', label: 'Plain Text' },
]
