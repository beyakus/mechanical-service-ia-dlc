import { Link, useLocation } from '@tanstack/react-router';
import { useUserRole } from '@/hooks/useAuth';
import { clsx } from 'clsx';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['technician', 'supervisor', 'admin'] },
  { path: '/calendar', label: 'Calendario', icon: '📅', roles: ['technician', 'supervisor', 'admin'] },
  { path: '/visits', label: 'Visitas', icon: '🔧', roles: ['technician', 'supervisor', 'admin'] },
  { path: '/analytics', label: 'Analytics', icon: '📈', roles: ['supervisor', 'admin'] },
  { path: '/admin/catalogs', label: 'Catálogos', icon: '⚙️', roles: ['admin'] },
] as const;

export function Sidebar() {
  const userRole = useUserRole();
  const location = useLocation();

  const visibleItems = userRole
    ? navItems.filter((item) => (item.roles as readonly string[]).includes(userRole.role))
    : navItems.filter((item) => (item.roles as readonly string[]).includes('admin'));

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4" data-testid="sidebar">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Visitas Mecánicas</h1>
      </div>
      <nav className="space-y-1">
        {visibleItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
              location.pathname === item.path
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white',
            )}
            data-testid={`sidebar-nav-${item.path.replace(/\//g, '-').slice(1)}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
