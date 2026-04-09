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
  collectionId: z.string().uuid().nullable().optional(),
})

const patchSchema = z.object({
  is_pinned: z.boolean().optional(),
  is_public: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'No fields to update' })

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
  const parsed = snippetSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || 'Invalid request body' },
      { status: 400 }
    )
  }
  const { title, description, language, content, commitMessage, tagIds, collectionId } = parsed.data

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
      ...(collectionId !== undefined && { collection_id: collectionId }),
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
      tagIds.map((tagId: string) => ({ snippet_id: id, tag_id: tagId }))
    )
  }

  // Fetch tags so response matches SnippetWithTags shape
  const { data: snippetTags } = await supabase
    .from('snippet_tags')
    .select('tags(id, name)')
    .eq('snippet_id', id)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tags = (snippetTags ?? []).map((st: any) => st.tags).filter(Boolean)

  return NextResponse.json({ snippet: { ...snippet, tags } })
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: Record<string, any> = { ...parsed.data }

  // Generate share_slug when enabling public sharing for the first time
  if (parsed.data.is_public) {
    const { data: existing } = await supabase
      .from('snippets').select('share_slug').eq('id', id).eq('user_id', user.id).single()
    if (!existing?.share_slug) {
      updates.share_slug = crypto.randomUUID().replace(/-/g, '').slice(0, 12)
    }
  }

  const { data: snippet, error } = await supabase
    .from('snippets')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ snippet })
}
