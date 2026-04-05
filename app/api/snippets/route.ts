import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

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

  // Get snippets
  let query = supabase
    .from('snippets')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,current_content.ilike.%${search}%`)
  }

  if (language) {
    query = query.eq('language', language)
  }

  const { data: snippets, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get tags for each snippet
  const snippetIds = snippets?.map(s => s.id) || []
  
  const { data: snippetTags } = await supabase
    .from('snippet_tags')
    .select('snippet_id, tag_id')
    .in('snippet_id', snippetIds.length > 0 ? snippetIds : [''])

  const { data: allTags } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', user.id)

  // Build snippet with tags
  const tagMap = new Map(allTags?.map(t => [t.id, t]) || [])
  const snippetsWithTags = snippets?.map(snippet => {
    const tagIdsForSnippet = snippetTags
      ?.filter(st => st.snippet_id === snippet.id)
      .map(st => st.tag_id) || []
    const tags = tagIdsForSnippet
      .map(id => tagMap.get(id))
      .filter(Boolean)
    return { ...snippet, tags }
  }) || []

  // Filter by tags if specified
  let filteredSnippets = snippetsWithTags
  if (tagIds.length > 0) {
    filteredSnippets = snippetsWithTags.filter(snippet =>
      tagIds.every(tagId => snippet.tags.some(t => t.id === tagId))
    )
  }

  return NextResponse.json({ snippets: filteredSnippets, tags: allTags || [] })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, language, content, commitMessage, tagIds } = body

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
