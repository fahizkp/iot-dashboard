import { useAuth } from '../hooks/useAuth';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';

export default function AdminPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-primary-500" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
}
