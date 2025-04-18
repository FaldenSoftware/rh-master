
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  company_value TEXT;
  role_value TEXT;
  name_value TEXT;
  phone_value TEXT;
  position_value TEXT;
  bio_value TEXT;
  email_value TEXT;
BEGIN
  -- Extract values from metadata safely with better logging
  RAISE LOG 'handle_new_user: Processing new user with metadata: %', NEW.raw_user_meta_data;
  
  company_value := NEW.raw_user_meta_data->>'company';
  role_value := NEW.raw_user_meta_data->>'role';
  name_value := NEW.raw_user_meta_data->>'name';
  phone_value := NEW.raw_user_meta_data->>'phone';
  position_value := NEW.raw_user_meta_data->>'position';
  bio_value := NEW.raw_user_meta_data->>'bio';
  email_value := NEW.email;
  
  RAISE LOG 'handle_new_user: Extracted values - name: %, role: %, company: %, email: %', 
    name_value, role_value, company_value, email_value;
  
  -- For mentors, company is required
  IF role_value = 'mentor' AND (company_value IS NULL OR company_value = '') THEN
    RAISE EXCEPTION 'Company is required for mentors';
  END IF;

  -- Check if profile already exists to avoid duplicate key errors
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    RAISE LOG 'handle_new_user: Profile already exists for user %', NEW.id;
    RETURN NEW;
  END IF;

  -- Insert profile with all necessary fields
  BEGIN
    INSERT INTO public.profiles (
      id, 
      name, 
      role,
      company,
      phone,
      position,
      bio,
      email
    )
    VALUES (
      NEW.id, 
      COALESCE(name_value, 'Usuário'),
      COALESCE(role_value, 'client'),
      company_value,
      phone_value,
      position_value,
      bio_value,
      email_value
    );
    
    RAISE LOG 'handle_new_user: Successfully created profile for user %', NEW.id;
  EXCEPTION 
    WHEN unique_violation THEN
      RAISE LOG 'handle_new_user: Duplicate key violation for user %, ignoring', NEW.id;
      -- Se houve violação de chave única, significa que o perfil já existe
      -- Não precisamos fazer nada, apenas retornar NEW
  END;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'handle_new_user: Error inserting profile for user %: %', NEW.id, SQLERRM;
    RAISE EXCEPTION 'Database error saving user profile: %', SQLERRM;
END;
$$;
