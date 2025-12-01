import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAgentStore } from '../store/agentStore';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AgentFormPage() {
  const { agentId } = useParams<{ agentId?: string }>();
  const navigate = useNavigate();
  const { selectedAgent, fetchAgent, createAgent, updateAgent, isLoading } = useAgentStore();
  const isEdit = !!agentId;

  const [formData, setFormData] = useState({
    agentId: '',
    agentIPaddress: '',
    callbackURL: '',
    isWhitelisted: true,
    cert: '',
  });

  useEffect(() => {
    if (isEdit && agentId) {
      fetchAgent(agentId);
    }
  }, [isEdit, agentId, fetchAgent]);

  useEffect(() => {
    if (isEdit && selectedAgent) {
      setFormData({
        agentId: selectedAgent.agentId,
        agentIPaddress: selectedAgent.agentIPaddress,
        callbackURL: selectedAgent.callbackURL,
        isWhitelisted: selectedAgent.isWhitelisted,
        cert: selectedAgent.cert || '',
      });
    }
  }, [isEdit, selectedAgent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      await updateAgent(agentId!, formData);
    } else {
      await createAgent(formData);
    }
    navigate('/agents');
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
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Agent' : 'Create Agent'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEdit ? 'Update agent information' : 'Add a new agent to the system'}
          </p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="card max-w-2xl"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="agent-id-form"
              name="agent-id-form"
              value={formData.agentId}
              onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
              required
              disabled={isEdit}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IP Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="agent-ip-address"
              name="agent-ip-address"
              value={formData.agentIPaddress}
              onChange={(e) => setFormData({ ...formData, agentIPaddress: e.target.value })}
              required
              placeholder="192.168.1.1"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Callback URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="callback-url"
              name="callback-url"
              value={formData.callbackURL}
              onChange={(e) => setFormData({ ...formData, callbackURL: e.target.value })}
              required
              placeholder="https://example.com/callback"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cert
            </label>
            <input
              type="password"
              id="agent-cert"
              name="agent-cert"
              value={formData.cert}
              onChange={(e) => setFormData({ ...formData, cert: e.target.value })}
              placeholder="Enter certificate (hidden)"
              className="input"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is-whitelisted"
              name="is-whitelisted"
              checked={formData.isWhitelisted}
              onChange={(e) => setFormData({ ...formData, isWhitelisted: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="is-whitelisted" className="ml-2 text-sm font-medium text-gray-700">
              Whitelisted
            </label>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={20} />
              {isLoading ? 'Saving...' : isEdit ? 'Update Agent' : 'Create Agent'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}

