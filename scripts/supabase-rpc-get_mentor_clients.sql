-- Função para buscar clientes de um mentor
CREATE OR REPLACE FUNCTION get_mentor_clients(mentor_id UUID)
RETURNS SETOF profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM profiles
  WHERE mentor_id = $1
  AND role = 'client';
END;
$$;
