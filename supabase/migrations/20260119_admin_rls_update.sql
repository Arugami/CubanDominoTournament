-- ============================================
-- ADMIN MANAGEMENT RLS POLICIES
-- Allow super_admins to manage admin_users
-- ============================================

-- Allow super_admins to insert new admin users
CREATE POLICY "Super admins can insert admin users"
  ON admin_users FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
      AND role = 'super_admin'
    )
  );

-- Allow super_admins to delete admin users
-- (but not themselves - enforced at application layer)
CREATE POLICY "Super admins can delete admin users"
  ON admin_users FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
      AND role = 'super_admin'
    )
  );

-- Allow super_admins to update admin users (for role changes, etc.)
CREATE POLICY "Super admins can update admin users"
  ON admin_users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
      AND role = 'super_admin'
    )
  );
