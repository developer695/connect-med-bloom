-- Drop the existing restrictive policies
DROP POLICY IF EXISTS "Anyone can create shared proposals" ON public.shared_proposals;
DROP POLICY IF EXISTS "Anyone can view shared proposals" ON public.shared_proposals;

-- Create permissive policies for public access (default is PERMISSIVE)
CREATE POLICY "Public can create shared proposals"
ON public.shared_proposals
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public can view shared proposals"
ON public.shared_proposals
FOR SELECT
TO anon, authenticated
USING (true);