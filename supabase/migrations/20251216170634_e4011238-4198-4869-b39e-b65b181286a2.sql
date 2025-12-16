-- Fix function search path security issue
CREATE OR REPLACE FUNCTION generate_share_id()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN substr(md5(random()::text), 1, 10);
END;
$$;