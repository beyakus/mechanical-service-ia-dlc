import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuth } from '@clerk/tanstack-start';
import { Layout } from '@/components/layout/Layout';

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isSignedIn) {
    throw redirect({ to: '/login' });
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
