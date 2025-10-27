-- Update the handle_new_user function to allow any signup with default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert into profiles with email from auth
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));

  -- Assign default 'cadet' role to all new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'cadet');

  RETURN NEW;
END;
$$;

-- Add RLS policies for admins to manage user roles
CREATE POLICY "Admins can update user roles"
ON public.user_roles
FOR UPDATE
USING (is_admin(auth.uid()));

-- Add policy for admins to delete user roles if needed
CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
USING (is_admin(auth.uid()));

-- Allow admins to insert new roles
CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
WITH CHECK (is_admin(auth.uid()));