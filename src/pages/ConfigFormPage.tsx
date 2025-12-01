import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useConfigStore } from '../store/configStore';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConfigFormPage() {
  const { key } = useParams<{ key?: string }>();
  const navigate = useNavigate();
  const { selectedConfig, fetchConfig, createConfig, updateConfig, isLoading } = useConfigStore();
  const isEdit = !!key;

  const [formData, setFormData] = useState({
    key: '',
    value: '',
  });

  useEffect(() => {
    if (isEdit && key) {
      fetchConfig(key);
    }
  }, [isEdit, key, fetchConfig]);

  useEffect(() => {
    if (isEdit && selectedConfig) {
      setFormData({
        key: selectedConfig.key,
        value: selectedConfig.value,
      });
    }
  }, [isEdit, selectedConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      await updateConfig(formData.key, formData.value);
    } else {
      await createConfig(formData.key, formData.value);
    }
    navigate('/config');
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
            {isEdit ? 'Edit Configuration' : 'Create Configuration'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEdit ? 'Update configuration value' : 'Add a new configuration entry'}
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
              Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="config-key"
              name="config-key"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              required
              disabled={isEdit}
              placeholder="e.g., game.betLimit.max"
              className="input"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use dot notation for nested keys (e.g., game.betLimit.max)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value <span className="text-red-500">*</span>
            </label>
            <textarea
              id="config-value"
              name="config-value"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              required
              rows={6}
              placeholder="Enter configuration value..."
              className="input resize-none"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={20} />
              {isLoading ? 'Saving...' : isEdit ? 'Update Config' : 'Create Config'}
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

