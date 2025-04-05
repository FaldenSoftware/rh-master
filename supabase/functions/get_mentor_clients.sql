
CREATE OR REPLACE FUNCTION public.get_mentor_clients(mentor_id uuid)
RETURNS SETOF profiles
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT * FROM public.profiles 
  WHERE mentor_id = $1 AND role = 'client';
$$;
