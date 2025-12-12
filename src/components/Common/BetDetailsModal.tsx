import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useBetStore } from '../../store/betStore';
import LoadingSpinner from './LoadingSpinner';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { BetStatus } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface BetDetailsModalProps {
  betId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BetDetailsModal({ betId, isOpen, onClose }: BetDetailsModalProps) {
  const { selectedBet, isLoading, fetchBet } = useBetStore();

  useEffect(() => {
    if (isOpen && betId) {
      fetchBet(betId);
    }
  }, [isOpen, betId, fetchBet]);

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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-gray-900">Bet Details</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : !selectedBet ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Bet not found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bet Information */}
                    <div className="card">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Bet Information</h3>
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

                    {/* Financial Details */}
                    <div className="card">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Financial Details</h3>
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
                        {selectedBet.finalCoeff && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Final Coefficient</label>
                            <p className="text-2xl font-bold text-blue-600">
                              {selectedBet.finalCoeff}
                            </p>
                          </div>
                        )}
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
                            <p className="text-sm font-mono text-gray-900 break-all">
                              {selectedBet.externalPlatformTxId}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

