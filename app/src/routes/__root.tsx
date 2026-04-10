import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ClerkProvider } from '@clerk/tanstack-start';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/lib/query-client';
import '@/styles/globals.css';

const queryClient = createQueryClient();

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
