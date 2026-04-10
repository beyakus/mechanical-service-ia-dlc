import { useClerk } from '@clerk/tanstack-start';
import { useUserRole } from '@/hooks/useAuth';

const roleBadgeColors: Record<string, string> = {
  technician: 'bg-blue-100 text-blue-800',
  supervisor: 'bg-green-100 text-green-800',
  admin: 'bg-purple-100 text-purple-800',
};

const roleLabels: Record<string, string> = {
  technician: 'Técnico',
  supervisor: 'Supervisor',
  admin: 'Admin',
};

export function Header() {
  const userRole = useUserRole();
  const { signOut } = useClerk();

  if (!userRole) return null;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6" data-testid="header">
      <div />
      <div className="flex items-center gap-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${roleBadgeColors[userRole.role] ?? ''}`}
          data-testid="header-role-badge"
        >
          {roleLabels[userRole.role] ?? userRole.role}
        </span>
        <span className="text-sm text-gray-700" data-testid="header-user-name">
          {userRole.name}
        </span>
        <button
          onClick={() => signOut()}
          className="text-sm text-gray-500 hover:text-gray-700"
          data-testid="header-logout-button"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
