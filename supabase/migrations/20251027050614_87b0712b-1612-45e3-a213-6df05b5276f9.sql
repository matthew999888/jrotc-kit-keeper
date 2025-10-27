-- Fix profiles table RLS to prevent public email exposure
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Allow users to view only their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT 
USING (auth.uid() = id);

-- Allow admins to view all profiles (needed for admin panel)
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT 
USING (is_admin(auth.uid()));