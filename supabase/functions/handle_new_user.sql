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
BEGIN
  -- Extract values from metadata safely
  company_value := NEW.raw_user_meta_data->>'company';
  role_value := NEW.raw_user_meta_data->>'role';
  name_value := NEW.raw_user_meta_data->>'name';
  phone_value := NEW.raw_user_meta_data->>'phone'; -- Extract safely
  position_value := NEW.raw_user_meta_data->>'position'; -- Extract safely
  bio_value := NEW.raw_user_meta_data->>'bio'; -- Extract safely
  
  -- For mentors, company is required
  IF role_value = 'mentor' AND (company_value IS NULL OR company_value = '') THEN
    RAISE EXCEPTION 'Company is required for mentors';
  END IF;

  -- Insert profile with all necessary fields, handling potentially missing ones
  INSERT INTO public.profiles (
    id, 
    name, 
    role,
    company,
    phone,    -- Use extracted value (which might be NULL)
    position, -- Use extracted value (which might be NULL)
    bio       -- Use extracted value (which might be NULL)
  )
  VALUES (
    NEW.id, 
    COALESCE(name_value, 'Usuário'), -- Fallback for name
    COALESCE(role_value, 'client'), -- Fallback for role
    company_value,                  -- Use extracted company value (validated above for mentors)
    phone_value,                    -- Use extracted phone value (will be NULL if not present)
    position_value,                 -- Use extracted position value (will be NULL if not present)
    bio_value                       -- Use extracted bio value (will be NULL if not present)
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the specific error for debugging
    RAISE LOG '[handle_new_user] Error inserting profile for user %: %', NEW.id, SQLERRM;
    
    -- Re-raise the exception to ensure the frontend knows about the failure
    -- This is better than returning NEW silently if profile creation is critical
    RAISE EXCEPTION 'Database error saving new user profile: %', SQLERRM; 
    -- Alternatively, if you want signup to succeed even if profile fails, keep RETURN NEW;
    -- RETURN NEW; 
END;
$$;
