import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserFormPage() {
  const { userId, agentId } = useParams<{ userId?: string; agentId?: string }>();
  const navigate = useNavigate();
  const { selectedUser, fetchUser, createUser, updateUser, isLoading } = useUserStore();
  const isEdit = !!userId && !!agentId;

  const [formData, setFormData] = useState({
    userId: '',
    agentId: '',
    username: '',
    currency: 'INR',
    betLimit: '1000',
    language: 'en',
  });

  useEffect(() => {
    if (isEdit && userId && agentId) {
      fetchUser(userId, agentId);
    }
  }, [isEdit, userId, agentId, fetchUser]);

  useEffect(() => {
    if (isEdit && selectedUser) {
      setFormData({
        userId: selectedUser.userId,
        agentId: selectedUser.agentId,
        username: selectedUser.username || '',
        currency: selectedUser.currency,
        betLimit: selectedUser.betLimit,
        language: selectedUser.language || 'en',
      });
    }
  }, [isEdit, selectedUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      await updateUser(userId!, agentId!, formData);
    } else {
      await createUser(formData);
    }
    navigate('/users');
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
            {isEdit ? 'Edit User' : 'Create User'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEdit ? 'Update user information' : 'Add a new user to the system'}
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
              User ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="user-id"
              name="user-id"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              required
              disabled={isEdit}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="agent-id"
              name="agent-id"
              value={formData.agentId}
              onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                required
                className="input"
              >
                <option value="INR">INR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bet Limit <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="bet-limit"
                name="bet-limit"
                value={formData.betLimit}
                onChange={(e) => setFormData({ ...formData, betLimit: e.target.value })}
                required
                min="0"
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="input"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={20} />
              {isLoading ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
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

