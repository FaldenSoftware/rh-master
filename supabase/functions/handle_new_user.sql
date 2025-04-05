
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  company_value TEXT;
  role_value TEXT;
BEGIN
  -- Extract values from metadata
  company_value := NEW.raw_user_meta_data->>'company';
  role_value := NEW.raw_user_meta_data->>'role';
  
  -- For mentors, company is required
  IF role_value = 'mentor' AND (company_value IS NULL OR company_value = '') THEN
    RAISE EXCEPTION 'Company is required for mentors';
  END IF;

  -- Insert profile with all necessary fields
  INSERT INTO public.profiles (
    id, 
    name, 
    role,
    company,
    phone,
    position,
    bio
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(role_value, 'client'),
    company_value,
    NULL,
    NULL,
    NULL
  );
  RETURN NEW;
END;
$$;
