import React, { useState, useEffect, useRef } from 'react';
import { Page, User } from '../types';
import { SearchIcon, BellIcon, ChevronDownIcon, LogoutIcon, HamburgerMenuIcon } from './icons';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onToggleSidebar: () => void;
  onInstallApp?: () => void;
  showInstallButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onToggleSidebar, onInstallApp, showInstallButton }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuRef]);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 shadow-sm">
      {/* Left section */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={onToggleSidebar} 
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden" 
          aria-label="Open sidebar"
        >
          <HamburgerMenuIcon className="h-5 w-5 text-gray-600" />
        </button>
        
        {/* Mobile search toggle */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle search"
        >
          <SearchIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Center section - Search bar */}
      <div className={`flex-1 max-w-md mx-4 ${isSearchOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-none transition-all duration-200 text-sm"
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-2">
        {/* Install App Button */}
        {showInstallButton && onInstallApp && (
          <button 
            onClick={onInstallApp}
            className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
            aria-label="Install App"
          >
            Install App
          </button>
        )}
        
        {/* Notifications */}
        <button 
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative" 
          aria-label="Notifications"
        >
          <BellIcon className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="User menu"
          >
            <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-700 truncate max-w-24">
                {user?.name || 'User'}
              </div>
              <div className="text-xs text-gray-500 truncate max-w-24">
                {user?.role?.name || 'Unknown'}
              </div>
            </div>
            <ChevronDownIcon className="h-4 w-4 text-gray-500 hidden md:block" />
          </button>

          {/* Dropdown menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg z-50 border border-gray-200/80">
              {/* User info */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-teal-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-2">
                <button className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <span className="text-gray-600 text-xs">👤</span>
                  </div>
                  <span>Profile</span>
                </button>
                
                <button className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <span className="text-gray-600 text-xs">⚙️</span>
                  </div>
                  <span>Settings</span>
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 py-2">
                <button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogoutIcon className="h-4 w-4 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;