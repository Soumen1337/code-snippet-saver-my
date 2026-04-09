export interface Snippet {
  id: string
  user_id: string
  title: string
  description: string | null
  language: string
  current_content: string
  is_pinned: boolean
  is_public: boolean
  share_slug: string | null
  collection_id: string | null
  created_at: string
  updated_at: string
}

export interface Collection {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
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
  collection: Collection | null
}

export type Language = 
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'rust'
  | 'go'
  | 'css'
  | 'html'
  | 'sql'
  | 'bash'
  | 'java'
  | 'cpp'
  | 'c'
  | 'csharp'
  | 'ruby'
  | 'php'
  | 'swift'
  | 'kotlin'
  | 'scala'
  | 'haskell'
  | 'lua'
  | 'perl'
  | 'r'
  | 'assembly'
  | 'json'
  | 'yaml'
  | 'markdown'
  | 'text'

export const SUPPORTED_LANGUAGES: { value: Language; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'css', label: 'CSS' },
  { value: 'html', label: 'HTML' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'scala', label: 'Scala' },
  { value: 'haskell', label: 'Haskell' },
  { value: 'lua', label: 'Lua' },
  { value: 'perl', label: 'Perl' },
  { value: 'r', label: 'R' },
  { value: 'assembly', label: 'Assembly' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'text', label: 'Plain Text' },
]

// Quick filter languages shown as chips in the dashboard
export const QUICK_FILTER_LANGUAGES: Language[] = [
  'javascript',
  'typescript',
  'python',
  'rust',
  'go',
  'css',
  'html',
  'sql',
  'bash',
  'java',
  'cpp',
  'c',
  'ruby',
]
