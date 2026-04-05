-- Snippets table
CREATE TABLE IF NOT EXISTS public.snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL DEFAULT 'javascript',
  current_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Snippet versions (Git-like history)
CREATE TABLE IF NOT EXISTS public.snippet_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snippet_id UUID NOT NULL REFERENCES public.snippets(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  commit_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(snippet_id, version_number)
);

-- Tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  UNIQUE(user_id, name)
);

-- Snippet-tags junction
CREATE TABLE IF NOT EXISTS public.snippet_tags (
  snippet_id UUID NOT NULL REFERENCES public.snippets(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (snippet_id, tag_id)
);

-- Enable RLS
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippet_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippet_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for snippets
CREATE POLICY "snippets_select_own" ON public.snippets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "snippets_insert_own" ON public.snippets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "snippets_update_own" ON public.snippets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "snippets_delete_own" ON public.snippets FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for snippet_versions (via snippet ownership)
CREATE POLICY "versions_select" ON public.snippet_versions FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.snippets WHERE snippets.id = snippet_versions.snippet_id AND snippets.user_id = auth.uid()));
CREATE POLICY "versions_insert" ON public.snippet_versions FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.snippets WHERE snippets.id = snippet_versions.snippet_id AND snippets.user_id = auth.uid()));

-- RLS Policies for tags
CREATE POLICY "tags_select_own" ON public.tags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tags_insert_own" ON public.tags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tags_update_own" ON public.tags FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "tags_delete_own" ON public.tags FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for snippet_tags (via snippet ownership)
CREATE POLICY "snippet_tags_select" ON public.snippet_tags FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.snippets WHERE snippets.id = snippet_tags.snippet_id AND snippets.user_id = auth.uid()));
CREATE POLICY "snippet_tags_insert" ON public.snippet_tags FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.snippets WHERE snippets.id = snippet_tags.snippet_id AND snippets.user_id = auth.uid()));
CREATE POLICY "snippet_tags_delete" ON public.snippet_tags FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.snippets WHERE snippets.id = snippet_tags.snippet_id AND snippets.user_id = auth.uid()));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_snippets_user_id ON public.snippets(user_id);
CREATE INDEX IF NOT EXISTS idx_snippets_updated_at ON public.snippets(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_snippet_versions_snippet_id ON public.snippet_versions(snippet_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON public.tags(user_id);
