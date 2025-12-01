import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AdminRole } from '../../types';
import {
  LayoutDashboard,
  Users,
  Receipt,
  Building2,
  Settings,
  LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [AdminRole.SUPER_ADMIN, AdminRole.AGENT] },
  { path: '/users', label: 'Users', icon: Users, roles: [AdminRole.SUPER_ADMIN, AdminRole.AGENT] },
  { path: '/bets', label: 'Bet History', icon: Receipt, roles: [AdminRole.SUPER_ADMIN, AdminRole.AGENT] },
  { path: '/agents', label: 'Agents', icon: Building2, roles: [AdminRole.SUPER_ADMIN] },
  { path: '/config', label: 'Game Config', icon: Settings, roles: [AdminRole.SUPER_ADMIN] },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({ isMobileOpen: externalIsMobileOpen, setIsMobileOpen: externalSetIsMobileOpen }: SidebarProps = {}) {
  const [internalIsMobileOpen, setInternalIsMobileOpen] = useState(false);

  // Use external state if provided, otherwise use internal state
  const isMobileOpen = externalIsMobileOpen !== undefined ? externalIsMobileOpen : internalIsMobileOpen;
  const setIsMobileOpen = externalSetIsMobileOpen || setInternalIsMobileOpen;

  return (
    <>
      {/* Sidebar - Desktop always visible, Mobile controlled by state */}
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white z-40">
        <SidebarContent onClose={() => {}} />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-[56px] w-64 h-[calc(100vh-56px)] bg-gradient-to-b from-gray-900 to-gray-800 text-white z-40"
          >
            <SidebarContent onClose={() => setIsMobileOpen(false)} hideLogo={true} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed top-[56px] left-0 right-0 bottom-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Sidebar content component
function SidebarContent({ onClose, hideLogo = false }: { onClose: () => void; hideLogo?: boolean }) {
  const location = useLocation();
  const { admin, logout } = useAuthStore();

  const filteredMenuItems = menuItems.filter(item =>
    admin?.role && item.roles.includes(admin.role)
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo - Hidden on mobile */}
      {!hideLogo && (
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <p className="text-sm text-gray-400 mt-1">Chicken Road</p>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-700">
        <div className="mb-3 px-4 py-3 bg-gray-800 rounded-lg flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            {(admin?.fullName || admin?.username || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{admin?.fullName || admin?.username}</p>
            <p className="text-xs text-gray-400 capitalize">
              {admin?.role?.replace('_', ' ').toLowerCase()}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

