import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const snippetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  language: z.string().min(1, 'Language is required'),
  content: z.string().min(1, 'Content is required'),
  description: z.string().optional(),
  commitMessage: z.string().optional(),
  tagIds: z.array(z.string().uuid()).optional().default([]),
})

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search') || ''
  const tagIds = searchParams.get('tags')?.split(',').filter(Boolean) || []
  const language = searchParams.get('language') || ''

  // Single JOIN query — snippets + tags in one round trip
  let query = supabase
    .from('snippets')
    .select('*, snippet_tags(tags(id, name))')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,current_content.ilike.%${search}%`)
  if (language) query = query.eq('language', language)

  const { data: snippets, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Flatten nested join shape → SnippetWithTags[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result = (snippets ?? []).map((s: any) => ({
    ...s,
    tags: (s.snippet_tags ?? []).map((st: any) => st.tags).filter(Boolean),
    snippet_tags: undefined,
  }))

  // Server-side AND-filter by tag IDs
  if (tagIds.length > 0) {
    result = result.filter(s =>
      tagIds.every(id => s.tags.some((t: { id: string }) => t.id === id))
    )
  }

  // Fetch all user tags for the sidebar filter list (single query, cheap)
  const { data: allTags } = await supabase.from('tags').select('*').eq('user_id', user.id).order('name')

  return NextResponse.json({ snippets: result, tags: allTags ?? [] })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = snippetSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || 'Invalid request body' },
      { status: 400 }
    )
  }
  const { title, description, language, content, commitMessage, tagIds } = parsed.data

  // Create snippet
  const { data: snippet, error } = await supabase
    .from('snippets')
    .insert({
      user_id: user.id,
      title,
      description: description || null,
      language,
      current_content: content,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Create initial version
  await supabase.from('snippet_versions').insert({
    snippet_id: snippet.id,
    version_number: 1,
    content,
    commit_message: commitMessage || 'Initial version',
  })

  // Add tags
  if (tagIds && tagIds.length > 0) {
    await supabase.from('snippet_tags').insert(
      tagIds.map((tagId: string) => ({
        snippet_id: snippet.id,
        tag_id: tagId,
      }))
    )
  }

  return NextResponse.json({ snippet })
}
