import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Users, Trash2, Plus, Building2, Globe, Shield, ShieldOff, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import apiService from '../services/api.service';
import { Agent } from '../types';
import AgentEditModal from '../components/Agents/AgentEditModal';
import { formatDate } from '../utils/formatters';

export default function AgentsListPage() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getAllAgents();
      if (response.status === '0000') {
        setAgents(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch agents');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch agents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedAgent(null);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (agentId: string) => {
    if (!window.confirm(`Are you sure you want to delete agent "${agentId}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await apiService.deleteAgent(agentId);
      if (response.status === '0000') {
        setSuccessMessage('Agent deleted successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchAgents(); // Refresh list
      } else {
        setError(response.message || 'Failed to delete agent');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete agent');
    }
  };

  const handleViewPlayers = (agentId: string) => {
    navigate(`/player-summary?agentId=${agentId}`);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedAgent(null);
  };

  const handleModalSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
    fetchAgents(); // Refresh list
    handleModalClose();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agents Management</h1>
          <p className="text-gray-600 mt-1">Manage all agents and their configurations</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => {
              setSelectedAgent(null);
              setIsEditModalOpen(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Create New Agent
          </button>
          <Link to="/agents/stats" className="btn-secondary flex items-center gap-2">
            <Building2 size={20} />
            View Statistics
          </Link>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4"
        >
          {successMessage}
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => {
                setError(null);
                fetchAgents();
              }}
              className="text-red-700 hover:text-red-900 underline text-sm"
            >
              Retry
            </button>
          </div>
        </motion.div>
      )}

      {/* Agents Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Building2 size={64} className="mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">No agents found</p>
          <p className="text-sm">Agents will appear here once they are created</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.agentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{agent.agentId}</h3>
                  <div className="flex items-center gap-2">
                    {agent.isWhitelisted ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        <Shield size={12} />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        <ShieldOff size={12} />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <Globe size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">Callback URL</p>
                    <p className="text-sm text-gray-900 truncate" title={agent.callbackURL}>
                      {agent.callbackURL}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Building2 size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">IP Address</p>
                    <p className="text-sm text-gray-900">{agent.agentIPaddress}</p>
                  </div>
                </div>

                {agent.currency && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5 flex-shrink-0">💰</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">Currency</p>
                      <p className="text-sm text-gray-900">{agent.currency}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <Calendar size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">Created</p>
                    <p className="text-sm text-gray-900">{formatDate(agent.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Card Footer - Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(agent)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleViewPlayers(agent.agentId)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                >
                  <Users size={16} />
                  Players
                </button>
                <button
                  onClick={() => handleDelete(agent.agentId)}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                  title="Delete Agent"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      <AgentEditModal
        agent={selectedAgent || undefined}
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        mode={selectedAgent ? 'edit' : 'create'}
      />
    </div>
  );
}

