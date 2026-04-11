import { useUser, useAuth as useClerkAuth } from '@clerk/tanstack-start';
import type { Role } from '@visits/shared';

export interface UserRole {
  role: Role;
  userId: string;
  zoneId: string | null;
  teamId: string | null;
  name: string;
  isTechnician: boolean;
  isSupervisor: boolean;
  isAdmin: boolean;
  canAccess: (requiredRoles: Role[]) => boolean;
}

export function useUserRole(): UserRole | null {
  const { user } = useUser();

  if (!user) return null;

  const role = (user.publicMetadata?.role as Role) ?? 'technician';
  const zoneId = (user.publicMetadata?.zoneId as string) ?? null;
  const teamId = (user.publicMetadata?.teamId as string) ?? null;

  return {
    role,
    userId: user.id,
    zoneId,
    teamId,
    name: user.fullName ?? user.firstName ?? 'Usuario',
    isTechnician: role === 'technician',
    isSupervisor: role === 'supervisor',
    isAdmin: role === 'admin',
    canAccess: (requiredRoles: Role[]) => requiredRoles.includes(role),
  };
}

export function useAuthToken() {
  const { getToken } = useClerkAuth();
  return async () => {
    const token = await getToken();
    return token ?? '';
  };
}
