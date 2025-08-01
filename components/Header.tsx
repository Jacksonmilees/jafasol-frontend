import React, { useState, useEffect, useRef } from 'react';
import { Page, User } from '../types';
import { SearchIcon, BellIcon, ChevronDownIcon, LogoutIcon, HamburgerMenuIcon } from './icons';

interface HeaderProps {
  currentPage: Page;
  currentUser: User;
  users: User[];
  onSetCurrentUser: (user: User) => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, currentUser, users, onSetCurrentUser, onLogout, onToggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 flex-shrink-0 non-printable">
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-gray-100 md:hidden mr-2" aria-label="Open sidebar">
          <HamburgerMenuIcon className="h-6 w-6 text-gray-500" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 truncate">{currentPage}</h1>
      </div>
      <div className="flex items-center space-x-2 md:space-x-6">
        <div className="relative hidden md:block">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-teal-500 focus:outline-none transition"
            aria-label="Search"
          />
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Notifications">
            <BellIcon className="h-6 w-6 text-gray-500" />
        </button>
        <div className="relative" ref={menuRef}>
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="h-9 w-9 rounded-full"
            />
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-700">{currentUser.name}</div>
              <div className="text-xs text-gray-500">{currentUser.role.name}</div>
            </div>
            <button className="hidden md:block p-1 rounded-full hover:bg-gray-100" aria-label="User menu">
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-20 border border-gray-200/80">
              <div className="p-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-700 px-2">Switch User (Demo)</p>
                <p className="text-xs text-gray-500 px-2">Simulate logging in as another user.</p>
              </div>
              <div className="py-1 max-h-60 overflow-y-auto" role="menu" aria-orientation="vertical">
                {users.map(user => (
                  <button
                    key={user.id}
                    onClick={() => { onSetCurrentUser(user); setIsMenuOpen(false); }}
                    className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <img src={user.avatarUrl} alt={user.name} className="h-7 w-7 rounded-full mr-3" />
                    <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role.name}</p>
                    </div>
                  </button>
                ))}
              </div>
               <div className="py-1 border-t border-gray-200" role="menu" aria-orientation="vertical">
                <button
                  onClick={onLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  <LogoutIcon className="w-4 h-4 mr-3" />
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