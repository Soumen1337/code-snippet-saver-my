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

  // Verify snippet ownership
  const { data: snippet } = await supabase
    .from('snippets')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!snippet) {
    return NextResponse.json({ error: 'Snippet not found' }, { status: 404 })
  }

  // Get versions
  const { data: versions, error } = await supabase
    .from('snippet_versions')
    .select('*')
    .eq('snippet_id', id)
    .order('version_number', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ versions })
}
