import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { ArrowLeft, Edit, User as UserIcon } from 'lucide-react';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { formatDate, formatCurrency } from '../utils/formatters';

export default function UserDetailsPage() {
  const { userId, agentId } = useParams<{ userId: string; agentId: string }>();
  const { selectedUser, isLoading, fetchUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId && agentId) {
      fetchUser(userId, agentId);
    }
  }, [userId, agentId, fetchUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">User not found</p>
        <Link to="/users" className="text-primary-500 hover:underline mt-4 inline-block">
          Back to Users
        </Link>
      </div>
    );
  }

  // Dummy statistics
  const stats = {
    totalBets: 150,
    totalBetAmount: '50000.00',
    totalWinAmount: '45000.00',
    winRate: 0.65,
    lastBetAt: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
          <p className="text-gray-500 mt-1">View and manage user information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {selectedUser.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedUser.username || selectedUser.userId}
                </h2>
                <p className="text-gray-500">User ID: {selectedUser.userId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Agent ID</label>
                <p className="text-lg font-semibold text-gray-900">{selectedUser.agentId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Currency</label>
                <p className="text-lg font-semibold text-gray-900">{selectedUser.currency}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Bet Limit</label>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(selectedUser.betLimit, selectedUser.currency)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Language</label>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedUser.language?.toUpperCase() || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(selectedUser.createdAt)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Updated At</label>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(selectedUser.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Total Bets</label>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBets}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Bet Amount</label>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(stats.totalBetAmount, selectedUser.currency)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Win Amount</label>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(stats.totalWinAmount, selectedUser.currency)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Win Rate</label>
                <p className="text-2xl font-bold text-green-600">
                  {(stats.winRate * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Bet</label>
                <p className="text-sm text-gray-900">{formatDate(stats.lastBetAt)}</p>
              </div>
            </div>
          </div>

          <Link
            to={`/users/${userId}/${agentId}`}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Edit size={20} />
            Edit User
          </Link>

          <Link
            to={`/bets?userId=${selectedUser.userId}`}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <UserIcon size={20} />
            View Bet History
          </Link>
        </div>
      </div>
    </div>
  );
}

