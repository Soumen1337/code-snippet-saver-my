import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: snippet, error } = await supabase
    .from('snippets')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !snippet) {
    return NextResponse.json({ error: 'Snippet not found' }, { status: 404 })
  }

  // Get tags
  const { data: snippetTags } = await supabase
    .from('snippet_tags')
    .select('tag_id')
    .eq('snippet_id', id)

  const tagIds = snippetTags?.map(st => st.tag_id) || []
  
  const { data: tags } = await supabase
    .from('tags')
    .select('*')
    .in('id', tagIds.length > 0 ? tagIds : [''])

  return NextResponse.json({ snippet: { ...snippet, tags: tags || [] } })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, language, content, commitMessage, tagIds } = body

  // Get existing snippet
  const { data: existing } = await supabase
    .from('snippets')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Snippet not found' }, { status: 404 })
  }

  // Update snippet
  const { data: snippet, error } = await supabase
    .from('snippets')
    .update({
      title,
      description: description || null,
      language,
      current_content: content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Create new version if content changed
  if (existing.current_content !== content) {
    const { data: lastVersion } = await supabase
      .from('snippet_versions')
      .select('version_number')
      .eq('snippet_id', id)
      .order('version_number', { ascending: false })
      .limit(1)
      .single()

    const nextVersion = (lastVersion?.version_number || 0) + 1

    await supabase.from('snippet_versions').insert({
      snippet_id: id,
      version_number: nextVersion,
      content,
      commit_message: commitMessage || `Version ${nextVersion}`,
    })
  }

  // Update tags
  await supabase.from('snippet_tags').delete().eq('snippet_id', id)
  
  if (tagIds && tagIds.length > 0) {
    await supabase.from('snippet_tags').insert(
      tagIds.map((tagId: string) => ({
        snippet_id: id,
        tag_id: tagId,
      }))
    )
  }

  return NextResponse.json({ snippet })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('snippets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
