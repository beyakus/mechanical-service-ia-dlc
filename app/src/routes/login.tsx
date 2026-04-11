import { createFileRoute } from '@tanstack/react-router';
import { SignIn } from '@clerk/tanstack-start';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" data-testid="login-page">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">
          Portal de Visitas Mecánicas
        </h1>
        <SignIn routing="hash" />
      </div>
    </div>
  );
}
