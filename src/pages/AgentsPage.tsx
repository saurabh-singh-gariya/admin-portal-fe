import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAgentStore } from '../store/agentStore';
import { Plus, Edit, Trash2, Building2, Users, Receipt, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { formatDate, formatCurrency } from '../utils/formatters';

export default function AgentsPage() {
  const { agents, isLoading, fetchAgents, deleteAgent } = useAgentStore();

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleDelete = async (agentId: string) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      await deleteAgent(agentId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agents</h1>
          <p className="text-gray-500 mt-1">Manage all agents in the system</p>
        </div>
        <Link to="/agents/new" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Agent
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.agentId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Building2 className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{agent.agentId}</h3>
                  <p className="text-sm text-gray-500">
                    {agent.isWhitelisted ? (
                      <span className="badge-success">Whitelisted</span>
                    ) : (
                      <span className="badge-warning">Not Whitelisted</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-medium text-gray-500">IP Address</label>
                <p className="text-sm font-semibold text-gray-900">{agent.agentIPaddress}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Callback URL</label>
                <p className="text-sm text-gray-900 break-all">{agent.callbackURL}</p>
              </div>
              {agent.statistics && (
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200">
                  <div>
                    <Users className="text-blue-500 mx-auto mb-1" size={20} />
                    <p className="text-xs text-gray-500">Users</p>
                    <p className="text-sm font-bold text-gray-900">
                      {agent.statistics.userCount}
                    </p>
                  </div>
                  <div>
                    <Receipt className="text-green-500 mx-auto mb-1" size={20} />
                    <p className="text-xs text-gray-500">Bets</p>
                    <p className="text-sm font-bold text-gray-900">
                      {agent.statistics.totalBets}
                    </p>
                  </div>
                  <div>
                    <DollarSign className="text-purple-500 mx-auto mb-1" size={20} />
                    <p className="text-xs text-gray-500">Volume</p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(agent.statistics.totalBetVolume, 'INR')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Created: {formatDate(agent.createdAt)}
              </p>
              <div className="flex items-center gap-2">
                <Link
                  to={`/agents/${agent.agentId}`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={18} />
                </Link>
                <button
                  onClick={() => handleDelete(agent.agentId)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

