import { useSelector } from 'react-redux';
import FreelancerDashboard from './FreelancerDashboard';
import ClientDashboard from './ClientDashboard';
import { InlineLoader } from '../../components/common/Loader';


export default function Dashboard() {
  const { user, isLoading } = useSelector((state) => state.auth);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 via-brand-light/10 to-white dark:from-gray-900 dark:via-brand-deepest dark:to-gray-900">
        <InlineLoader size="large" text="Loading Dashboard" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 via-brand-light/10 to-white dark:from-gray-900 dark:via-brand-deepest dark:to-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">No user data available</p>
        </div>
      </div>
    );
  }

  // Route based on user role
  switch (user.role) {
    case 'freelancer':
      return <FreelancerDashboard user={user} />;
    
    case 'client':
      return <ClientDashboard user={user} />;
    
    case 'admin':
      // Admin users should be redirected to admin dashboard, not regular dashboard
      // If they somehow reach here, redirect them
      window.location.href = '/admin/dashboard';
      return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 via-brand-light/10 to-white dark:from-gray-900 dark:via-brand-deepest dark:to-gray-900">
          <InlineLoader size="large" text="Redirecting to Admin Dashboard..." />
        </div>
      );
    
    default:
      return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 via-brand-light/10 to-white dark:from-gray-900 dark:via-brand-deepest dark:to-gray-900">
          <div className="text-center max-w-md px-4">
            <h2 className="text-2xl font-bold text-brand-deepest dark:text-white mb-2">
              Invalid Role
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your account role is not recognized. Please contact support.
            </p>
          </div>
        </div>
      );
  }
}