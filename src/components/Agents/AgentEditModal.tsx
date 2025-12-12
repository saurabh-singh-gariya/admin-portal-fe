import { useState, useEffect } from 'react';
import { X, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../../services/api.service';
import { Agent } from '../../types';
import LoadingSpinner from '../Common/LoadingSpinner';
import GameMultiSelect from '../Common/GameMultiSelect';

interface AgentEditModalProps {
  agent?: Agent; // Optional for create mode
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  mode?: 'create' | 'edit'; // 'create' or 'edit' mode
}

interface Game {
  gameCode: string;
  gameName: string;
  isActive: boolean;
}

export default function AgentEditModal({ agent, isOpen, onClose, onSuccess, mode = 'edit' }: AgentEditModalProps) {
  const isCreateMode = mode === 'create';
  const [formData, setFormData] = useState({
    agentId: agent?.agentId || '',
    cert: agent?.cert || '',
    agentIPaddress: agent?.agentIPaddress || '',
    callbackURL: agent?.callbackURL || '',
    isWhitelisted: agent?.isWhitelisted !== undefined ? agent.isWhitelisted : true,
    currency: agent?.currency || 'INR',
    allowedGameCodes: agent?.allowedGameCodes || [],
    password: '', // Only for create mode
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [availableGames, setAvailableGames] = useState<Game[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch available games when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailableGames();
      if (isCreateMode) {
        // Reset form for create mode
        setFormData({
          agentId: '',
          cert: '',
          agentIPaddress: '',
          callbackURL: '',
          isWhitelisted: true,
          currency: 'INR',
          allowedGameCodes: [],
          password: '',
        });
      } else if (agent) {
        // Set form data for edit mode
        setFormData({
          agentId: agent.agentId,
          cert: agent.cert || '',
          agentIPaddress: agent.agentIPaddress || '',
          callbackURL: agent.callbackURL || '',
          isWhitelisted: agent.isWhitelisted || false,
          currency: agent.currency || 'INR',
          allowedGameCodes: agent.allowedGameCodes || [],
          password: '', // Not used in edit mode
        });
      }
      setError(null);
      setShowDeleteConfirm(false);
    }
  }, [isOpen, agent, isCreateMode]);

  const fetchAvailableGames = async () => {
    setIsLoadingGames(true);
    try {
      const games = await apiService.getActiveGames();
      setAvailableGames(games || []);
    } catch (err) {
      console.error('Failed to fetch games:', err);
      setAvailableGames([]);
    } finally {
      setIsLoadingGames(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isCreateMode) {
        // Validate required fields for create
        if (!formData.agentId || !formData.cert || !formData.agentIPaddress || !formData.callbackURL || !formData.password) {
          setError('Please fill in all required fields');
          setIsLoading(false);
          return;
        }

        // Validate agentId: alphanumeric, max 20 characters
        if (!/^[a-zA-Z0-9]+$/.test(formData.agentId)) {
          setError('Agent ID must contain only alphanumeric characters');
          setIsLoading(false);
          return;
        }

        if (formData.agentId.length > 20) {
          setError('Agent ID must be 20 characters or less');
          setIsLoading(false);
          return;
        }

        // Validate password: min 8 characters
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters long');
          setIsLoading(false);
          return;
        }

        const createData: any = {
          agentId: formData.agentId,
          cert: formData.cert,
          agentIPaddress: formData.agentIPaddress,
          callbackURL: formData.callbackURL,
          currency: formData.currency || 'INR',
          isWhitelisted: formData.isWhitelisted,
          allowedGameCodes: formData.allowedGameCodes || [],
          password: formData.password,
        };

        const response = await apiService.createAgent(createData);
        if (response.status === '0000') {
          onSuccess('Agent created successfully');
        } else {
          setError(response.message || 'Failed to create agent');
        }
      } else {
        // Edit mode
        if (!agent) {
          setError('Agent not found');
          setIsLoading(false);
          return;
        }

        const updateData: any = {
          cert: formData.cert || undefined,
          agentIPaddress: formData.agentIPaddress || undefined,
          callbackURL: formData.callbackURL || undefined,
          isWhitelisted: formData.isWhitelisted,
          currency: formData.currency || undefined,
        };

        // allowedGameCodes is already an array
        updateData.allowedGameCodes = formData.allowedGameCodes || [];

        const response = await apiService.updateAgent(agent.agentId, updateData);
        if (response.status === '0000') {
          onSuccess('Agent updated successfully');
        } else {
          setError(response.message || 'Failed to update agent');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Failed to ${isCreateMode ? 'create' : 'update'} agent`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!agent) {
      setError('Agent not found');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await apiService.deleteAgent(agent.agentId);
      if (response.status === '0000') {
        onSuccess('Agent deleted successfully');
        onClose();
      } else {
        setError(response.message || 'Failed to delete agent');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete agent');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isCreateMode ? 'Create New Agent' : `Edit Agent: ${agent?.agentId}`}
                </h2>
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
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Agent ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agent ID {isCreateMode && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.agentId}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow alphanumeric characters
                        if (/^[a-zA-Z0-9]*$/.test(value) && value.length <= 20) {
                          handleInputChange('agentId', value);
                        }
                      }}
                      disabled={!isCreateMode}
                      required={isCreateMode}
                      maxLength={20}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        !isCreateMode ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
                      }`}
                      placeholder={isCreateMode ? 'Enter agent ID (alphanumeric, max 20 chars)' : ''}
                    />
                    {isCreateMode && (
                      <p className="mt-1 text-xs text-gray-500">
                        Alphanumeric characters only, maximum 20 characters
                      </p>
                    )}
                  </div>

                  {/* Password (Only for create mode) */}
                  {isCreateMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          required
                          minLength={8}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter password (min 8 characters)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Minimum 8 characters required
                      </p>
                    </div>
                  )}

                  {/* Certificate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certificate {isCreateMode && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.cert}
                      onChange={(e) => handleInputChange('cert', e.target.value)}
                      required={isCreateMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter certificate"
                    />
                  </div>

                  {/* IP Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IP Address {isCreateMode && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.agentIPaddress}
                      onChange={(e) => handleInputChange('agentIPaddress', e.target.value)}
                      required={isCreateMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter IP address (use * for wildcard)"
                    />
                  </div>

                  {/* Callback URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Callback URL {isCreateMode && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="url"
                      value={formData.callbackURL}
                      onChange={(e) => handleInputChange('callbackURL', e.target.value)}
                      required={isCreateMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://example.com/callback"
                    />
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <input
                      type="text"
                      value={formData.currency}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  {/* Allowed Game Codes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allowed Game Codes
                    </label>
                    <GameMultiSelect
                      selectedGames={formData.allowedGameCodes}
                      onChange={(gameCodes) => handleInputChange('allowedGameCodes', gameCodes)}
                      availableGames={availableGames}
                      isLoading={isLoadingGames}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Search and select games to allow for this agent
                    </p>
                  </div>

                  {/* Is Active (isWhitelisted in backend) */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isWhitelisted"
                      checked={formData.isWhitelisted}
                      onChange={(e) => handleInputChange('isWhitelisted', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isWhitelisted" className="ml-2 block text-sm text-gray-700">
                      Active
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    {!isCreateMode && (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isLoading || isDeleting}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                        Delete Agent
                      </button>
                    )}
                    {isCreateMode && <div />}

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading || isDeleting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || isDeleting}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isLoading && <LoadingSpinner size="sm" />}
                        {isCreateMode ? 'Create Agent' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && agent && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDeleteConfirm(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative z-10"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Agent</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Are you sure you want to delete agent <strong>{agent.agentId}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isDeleting && <LoadingSpinner size="sm" />}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}

