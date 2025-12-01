import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useConfigStore } from '../store/configStore';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { formatDate } from '../utils/formatters';

export default function ConfigPage() {
  const { configs, isLoading, fetchConfigs, deleteConfig } = useConfigStore();

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const handleDelete = async (key: string) => {
    if (window.confirm('Are you sure you want to delete this configuration?')) {
      await deleteConfig(key);
    }
  };

  const maskSensitiveValue = (key: string, value: string) => {
    if (key.toLowerCase().includes('secret') || key.toLowerCase().includes('password')) {
      return '***hidden***';
    }
    return value;
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
          <h1 className="text-3xl font-bold text-gray-900">Game Configuration</h1>
          <p className="text-gray-500 mt-1">Manage game settings and configuration</p>
        </div>
        <Link to="/config/new" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Config
        </Link>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Updated At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {configs.map((config, index) => (
                <motion.tr
                  key={config.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Settings className="text-gray-400" size={16} />
                      <span className="text-sm font-medium text-gray-900">{config.key}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-mono">
                      {maskSensitiveValue(config.key, config.value)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(config.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/config/${config.key}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(config.key)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

