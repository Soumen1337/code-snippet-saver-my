'use client'

import { Highlight, themes } from 'prism-react-renderer'
import { Language } from '@/lib/types'

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  language: Language
  readOnly?: boolean
  className?: string
}

const languageMap: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  rust: 'rust',
  go: 'go',
  css: 'css',
  html: 'markup',
  sql: 'sql',
  bash: 'bash',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  csharp: 'csharp',
  ruby: 'ruby',
  php: 'php',
  swift: 'swift',
  kotlin: 'kotlin',
  scala: 'scala',
  haskell: 'haskell',
  lua: 'lua',
  perl: 'perl',
  r: 'r',
  assembly: 'nasm',
  json: 'json',
  yaml: 'yaml',
  markdown: 'markdown',
  text: 'markup',
}

export function CodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
  className = '',
}: CodeEditorProps) {
  const prismLanguage = languageMap[language] || 'markup'

  if (readOnly) {
    return (
      <div className={`rounded-md border border-border bg-[#0d1117] overflow-auto ${className}`}>
        <Highlight
          theme={themes.nightOwl}
          code={value}
          language={prismLanguage}
        >
          {({ className: preClassName, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${preClassName} p-4 text-sm font-mono overflow-x-auto`}
              style={{ ...style, background: 'transparent', margin: 0 }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })} className="flex">
                  <span className="select-none pr-4 text-muted-foreground/50 text-right min-w-[2.5rem]">
                    {i + 1}
                  </span>
                  <span>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    )
  }

  return (
    <div className={`relative rounded-md border border-border bg-[#0d1117] overflow-hidden ${className}`}>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="absolute inset-0 w-full h-full resize-none bg-transparent p-4 font-mono text-sm text-transparent caret-white outline-none z-10 leading-relaxed"
        spellCheck={false}
        style={{ caretColor: '#fff' }}
      />
      <div className="pointer-events-none min-h-full">
        <Highlight
          theme={themes.nightOwl}
          code={value || ' '}
          language={prismLanguage}
        >
          {({ className: preClassName, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${preClassName} p-4 text-sm font-mono leading-relaxed`}
              style={{ ...style, background: 'transparent', margin: 0 }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  )
}
