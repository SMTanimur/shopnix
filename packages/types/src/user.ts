export type UserRole = 'owner' | 'admin' | 'manager' | 'staff';

export const USER_ROLES = {
  OWNER: 'owner' as UserRole,
  ADMIN: 'admin' as UserRole,
  MANAGER: 'manager' as UserRole,
  STAFF: 'staff' as UserRole,
} as const;

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: UserRole;
  organization_id: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
  organizationId: string;
  firstName: string;
  lastName: string;
}
