
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  company_value TEXT;
  role_value TEXT;
BEGIN
  -- Extrair valores dos metadados
  company_value := NEW.raw_user_meta_data->>'company';
  role_value := NEW.raw_user_meta_data->>'role';
  
  -- Para mentores, empresa é obrigatória
  IF role_value = 'mentor' AND (company_value IS NULL OR company_value = '') THEN
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
    COALESCE(role_value, 'client'),
    company_value
  );
  RETURN NEW;
END;
$$;
