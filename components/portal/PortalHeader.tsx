import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types';
import { BellIcon, ChevronDownIcon, LogoIcon, LogoutIcon } from '../icons';

interface PortalHeaderProps {
  currentUser: User;
  users: User[];
  onSetCurrentUser: (user: User) => void;
  onLogout: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({ currentUser, users, onSetCurrentUser, onLogout }) => {
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
    <header className="bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 flex-shrink-0 non-printable">
        <div className="flex items-center">
            <LogoIcon className="h-8 w-8 text-indigo-500" />
            <span className="ml-3 text-lg font-semibold text-slate-800 hidden sm:inline">JafaSol Portal</span>
        </div>
        <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="Notifications">
                <BellIcon className="h-6 w-6 text-slate-500" />
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
                <div className="text-sm font-medium text-slate-700">{currentUser.name}</div>
                <div className="text-xs text-slate-500">{currentUser.role.name}</div>
                </div>
                <button className="hidden md:block p-1 rounded-full hover:bg-slate-100" aria-label="User menu">
                <ChevronDownIcon className="h-5 w-5 text-slate-500" />
                </button>
            </div>
            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-20 border border-slate-200/80">
                <div className="p-2 border-b border-slate-200">
                    <p className="text-sm font-medium text-slate-700 px-2">Switch User (Demo)</p>
                    <p className="text-xs text-slate-500 px-2">Simulate logging in as another user.</p>
                </div>
                <div className="py-1 max-h-60 overflow-y-auto" role="menu" aria-orientation="vertical">
                    {users.map(user => (
                    <button
                        key={user.id}
                        onClick={() => { onSetCurrentUser(user); setIsMenuOpen(false); }}
                        className="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        role="menuitem"
                    >
                        <img src={user.avatarUrl} alt={user.name} className="h-7 w-7 rounded-full mr-3" />
                        <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.role.name}</p>
                        </div>
                    </button>
                    ))}
                </div>
                 <div className="py-1 border-t border-slate-200" role="menu" aria-orientation="vertical">
                    <button
                        onClick={onLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
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