import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';

const Profile = () => {
  const { user, role, isLoading } = useAuth();

  if (isLoading) return <Loading message="Loading profile..." />;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  const displayName = user.username || user.name || 'User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-2xl font-bold">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-100">{displayName}</h1>
            <p className="text-primary-400 text-sm font-medium capitalize">
              {role} Account
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h2 className="text-lg font-semibold text-gray-200 mb-6">
          Account Details
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <span className="text-gray-500">Email</span>
            <span className="text-gray-200">{user.email}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <span className="text-gray-500">Phone</span>
            <span className="text-gray-200">{user.phone_number || '—'}</span>
          </div>

          {role === 'user' && user.username && (
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <span className="text-gray-500">Username</span>
              <span className="text-gray-200">@{user.username}</span>
            </div>
          )}

          {role === 'organizer' && user.name && (
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <span className="text-gray-500">Organization</span>
              <span className="text-gray-200 capitalize">{user.name}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-3">
            <span className="text-gray-500">Account Type</span>
            <span className="bg-primary-600/20 text-primary-400 px-3 py-1 rounded-full text-xs font-semibold uppercase">
              {role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;