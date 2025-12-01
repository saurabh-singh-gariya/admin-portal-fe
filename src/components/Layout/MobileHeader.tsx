import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

export default function MobileHeader() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { admin } = useAuthStore();

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-gray-900 to-gray-800 text-white border-b border-gray-700 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Menu Button & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center text-white"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Admin Portal
              </h1>
              <p className="text-xs text-gray-400">Chicken Road</p>
            </div>
          </div>

          {/* User Info - Logout hidden on mobile */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {(admin?.fullName || admin?.username || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-medium text-white">{admin?.fullName || admin?.username}</p>
                <p className="text-xs text-gray-400 capitalize">
                  {admin?.role?.replace('_', ' ').toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Pass mobile menu state to Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
    </>
  );
}

