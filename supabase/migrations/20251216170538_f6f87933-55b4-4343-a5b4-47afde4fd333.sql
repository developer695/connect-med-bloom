-- Create table to store shared proposals
CREATE TABLE public.shared_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  share_id TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_uuid()::text::bytea, 'base64'),
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days')
);

-- Create a simpler share_id for URLs
CREATE OR REPLACE FUNCTION generate_share_id()
RETURNS TEXT AS $$
BEGIN
  RETURN substr(md5(random()::text), 1, 10);
END;
$$ LANGUAGE plpgsql;

-- Update default to use simpler ID
ALTER TABLE public.shared_proposals ALTER COLUMN share_id SET DEFAULT generate_share_id();

-- Enable RLS but allow public read access (view-only)
ALTER TABLE public.shared_proposals ENABLE ROW LEVEL SECURITY;

-- Anyone can read shared proposals (they're meant to be public)
CREATE POLICY "Anyone can view shared proposals"
ON public.shared_proposals
FOR SELECT
USING (true);

-- Anyone can create shared proposals (no auth required for sharing)
CREATE POLICY "Anyone can create shared proposals"
ON public.shared_proposals
FOR INSERT
WITH CHECK (true);