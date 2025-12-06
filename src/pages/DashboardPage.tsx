import { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { useAuthStore } from '../store/authStore';
import { Users, Building2, Receipt, TrendingUp, Activity, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function DashboardPage() {
  const { stats, isLoading, fetchDashboardStats } = useDashboardStore();
  const { admin } = useAuthStore();

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Dummy chart data
  const revenueData = [
    { name: 'Mon', revenue: 12000, bets: 450 },
    { name: 'Tue', revenue: 15000, bets: 520 },
    { name: 'Wed', revenue: 18000, bets: 600 },
    { name: 'Thu', revenue: 14000, bets: 480 },
    { name: 'Fri', revenue: 22000, bets: 750 },
    { name: 'Sat', revenue: 25000, bets: 850 },
    { name: 'Sun', revenue: 20000, bets: 700 },
  ];

  const difficultyData = [
    { name: 'Easy', value: 2000, color: '#10b981' },
    { name: 'Medium', value: 1500, color: '#3b82f6' },
    { name: 'Hard', value: 1000, color: '#f59e0b' },
    { name: 'Daredevil', value: 500, color: '#ef4444' },
  ];

  const statCards = [
    {
      title: 'Total Players',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
    },
    {
      title: 'Total Agents',
      value: stats?.totalAgents || 0,
      icon: Building2,
      color: 'from-purple-500 to-purple-600',
      change: '+5%',
      hideForAgent: true,
    },
    {
      title: 'Total Bets',
      value: formatNumber(stats?.totalBets || 0),
      icon: Receipt,
      color: 'from-green-500 to-green-600',
      change: '+23%',
    },
    {
      title: 'Net Revenue',
      value: formatCurrency(stats?.netRevenue || '0', 'INR'),
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600',
      change: '+18%',
    },
  ];

  const filteredStatCards = statCards.filter(card => 
    !card.hideForAgent || admin?.role === 'SUPER_ADMIN'
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mt-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Welcome back, {admin?.fullName || admin?.username}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredStatCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card group hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <TrendingUp size={14} />
                    {card.change} from last month
                  </p>
                </div>
                <div className={`p-4 rounded-xl bg-gradient-to-br ${card.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white" size={28} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue & Bets Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Revenue ($)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bets"
                stroke="#10b981"
                strokeWidth={2}
                name="Bets"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Difficulty Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bets by Difficulty</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {difficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-primary-500" size={24} />
            <h3 className="text-lg font-semibold">Active Players</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.activeUsers || 0}</p>
          <p className="text-sm text-gray-500 mt-2">Currently online</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="text-green-500" size={24} />
            <h3 className="text-lg font-semibold">Total Bet Amount</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(stats?.totalBetVolume || '0', 'INR')}
          </p>
          <p className="text-sm text-gray-500 mt-2">All-time bet volume</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-orange-500" size={24} />
            <h3 className="text-lg font-semibold">Total Win Amount</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(stats?.totalWinAmount || '0', 'INR')}
          </p>
          <p className="text-sm text-gray-500 mt-2">Total winnings paid</p>
        </motion.div>
      </div>
    </div>
  );
}

