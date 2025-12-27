import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

export default function AdminDashboard() {
  const { admin, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Admin Panel</h1>
        <p className="text-gray-600 mb-8">Welcome, {admin?.username}</p>
        <button
          onClick={handleLogout}
          className="px-6 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
