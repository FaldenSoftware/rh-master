
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  company_value TEXT;
  role_value TEXT;
  name_value TEXT;
BEGIN
  -- Extract values from metadata
  company_value := NEW.raw_user_meta_data->>'company';
  role_value := NEW.raw_user_meta_data->>'role';
  name_value := NEW.raw_user_meta_data->>'name';
  
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
    COALESCE(name_value, 'Usuário'),
    COALESCE(role_value, 'client'),
    company_value,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'position',
    NEW.raw_user_meta_data->>'bio'
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error (this will appear in Supabase logs)
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    
    -- Return NEW to continue the transaction
    -- This prevents the signup from failing if profile creation fails
    RETURN NEW;
END;
$$;
