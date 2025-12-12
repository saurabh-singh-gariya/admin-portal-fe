import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBetStore } from '../store/betStore';
import { ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { formatDate, formatCurrency } from '../utils/formatters';
import { BetStatus } from '../types';

export default function BetDetailsPage() {
  const { betId } = useParams<{ betId: string }>();
  const { selectedBet, isLoading, fetchBet } = useBetStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (betId) {
      fetchBet(betId);
    }
  }, [betId, fetchBet]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!selectedBet) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Bet not found</p>
        <button
          onClick={() => navigate('/bets')}
          className="text-primary-500 hover:underline mt-4"
        >
          Back to Bets
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    // Handle both enum values and string values
    const statusKey = status as BetStatus;
    const styles: Record<string, string> = {
      [BetStatus.PLACED]: 'badge-warning',
      [BetStatus.PENDING_SETTLEMENT]: 'badge-warning',
      [BetStatus.WON]: 'badge-success',
      [BetStatus.LOST]: 'badge-danger',
      [BetStatus.CANCELLED]: 'badge-info',
      [BetStatus.REFUNDED]: 'badge-info',
      [BetStatus.SETTLEMENT_FAILED]: 'badge-warning',
      // Fallback for string values
      'PLACED': 'badge-warning',
      'PENDING_SETTLEMENT': 'badge-warning',
      'WON': 'badge-success',
      'LOST': 'badge-danger',
      'CANCELLED': 'badge-info',
      'REFUNDED': 'badge-info',
      'SETTLEMENT_FAILED': 'badge-warning',
    };
    
    const badgeClass = styles[statusKey] || styles[status] || 'badge-secondary';
    // Format status for display (replace underscores with spaces, capitalize)
    const displayStatus = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return <span className={`badge ${badgeClass}`}>{displayStatus}</span>;
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
          <h1 className="text-3xl font-bold text-gray-900">Bet Details</h1>
          <p className="text-gray-500 mt-1">View detailed bet information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bet Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Bet ID</label>
              <p className="text-lg font-semibold text-gray-900">{selectedBet.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Player ID</label>
              <p className="text-lg font-semibold text-gray-900">{selectedBet.userId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Agent ID</label>
              <p className="text-lg font-semibold text-gray-900">{selectedBet.agentId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Round ID</label>
              <p className="text-lg font-semibold text-gray-900">
                {selectedBet.roundId || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">{getStatusBadge(selectedBet.status)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Difficulty</label>
              <p className="text-lg font-semibold text-gray-900">{selectedBet.difficulty}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Bet Amount</label>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(selectedBet.betAmount, selectedBet.currency)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Win Amount</label>
              <p className="text-2xl font-bold text-green-600">
                {selectedBet.winAmount
                  ? formatCurrency(selectedBet.winAmount, selectedBet.currency)
                  : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Currency</label>
              <p className="text-lg font-semibold text-gray-900">{selectedBet.currency}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Bet Placed At</label>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(selectedBet.betPlacedAt)}
              </p>
            </div>
            {selectedBet.settledAt && (
              <div>
                <label className="text-sm font-medium text-gray-500">Settled At</label>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(selectedBet.settledAt)}
                </p>
              </div>
            )}
            {selectedBet.externalPlatformTxId && (
              <div>
                <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                <p className="text-sm font-mono text-gray-900">
                  {selectedBet.externalPlatformTxId}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

