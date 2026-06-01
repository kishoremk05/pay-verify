-- Allow anonymous/public users to read invitations by token to allow onboarding
CREATE POLICY "Anyone can view a specific invitation by its token" ON public.invitations
  FOR SELECT TO public USING (token IS NOT NULL AND accepted_at IS NULL);

-- Allow anonymous/public users to view organization names associated with pending invitations
CREATE POLICY "Anyone can view organization names for active invitations" ON public.organizations
  FOR SELECT TO public USING (
    id IN (
      SELECT organization_id 
      FROM public.invitations 
      WHERE accepted_at IS NULL
    )
  );
