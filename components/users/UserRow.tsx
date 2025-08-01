
import React, { useState, useEffect, useRef } from 'react';
import { User, Page } from '../../types';
import { MoreHorizontalIcon, PencilIcon } from '../icons';

interface UserRowProps {
    user: User;
    onEdit: (user: User) => void;
    currentUser: User;
}

export const UserRow: React.FC<UserRowProps> = ({ user, onEdit, currentUser }) => {
    const statusColor = user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const canEdit = currentUser.role.permissions[Page.UserManagement]?.edit;

    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="py-3 px-6">
                <div className="flex items-center">
                    <img className="h-9 w-9 rounded-full object-cover" src={user.avatarUrl} alt={user.name} />
                    <div className="ml-3">
                        <p className="font-semibold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.id}</p>
                    </div>
                </div>
            </td>
            <td className="py-3 px-6 text-slate-600 hidden sm:table-cell">{user.email}</td>
            <td className="py-3 px-6 text-slate-600">{user.role.name}</td>
            <td className="py-3 px-6">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                    {user.status}
                </span>
            </td>
            <td className="py-3 px-6 text-right">
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className="p-2 rounded-md hover:bg-slate-200 transition-colors" 
                        aria-label={`Actions for ${user.name}`}
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen}
                    >
                        <MoreHorizontalIcon className="h-5 w-5 text-slate-500" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-slate-200/80">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                {canEdit && (
                                    <button onClick={() => { onEdit(user); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem">
                                        <PencilIcon className="w-4 h-4 mr-3" />
                                        Edit User
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};
