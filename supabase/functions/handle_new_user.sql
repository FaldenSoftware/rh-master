
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  company_value TEXT;
BEGIN
  -- Extrair o valor da empresa dos metadados, ou definir como NULL se não existir
  company_value := NEW.raw_user_meta_data->>'company';
  
  -- Para mentores, empresa não pode ser NULL ou vazia
  IF NEW.raw_user_meta_data->>'role' = 'mentor' AND (company_value IS NULL OR company_value = '') THEN
    RAISE EXCEPTION 'Company is required for mentors';
  END IF;

  INSERT INTO public.profiles (
    id, 
    name, 
    role,
    company
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    company_value
  );
  RETURN NEW;
END;
$$;
