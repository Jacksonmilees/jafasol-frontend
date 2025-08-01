
import React, { useState, useEffect, useRef } from 'react';
import { SchoolClass, User, Page } from '../../types';
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from '../icons';

interface ClassRowProps {
    schoolClass: SchoolClass;
    onEdit: (schoolClass: SchoolClass) => void;
    onDelete: (schoolClass: SchoolClass) => void;
    currentUser: User;
}

export const ClassRow: React.FC<ClassRowProps> = ({ schoolClass, onEdit, onDelete, currentUser }) => {
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

    const canEdit = currentUser.role.permissions[Page.Academics]?.edit;
    const canDelete = currentUser.role.permissions[Page.Academics]?.delete;

    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="py-3 px-6">
                 <p className="font-semibold text-slate-800">{schoolClass.name}</p>
            </td>
            <td className="py-3 px-6 text-slate-600">{schoolClass.teacher}</td>
            <td className="py-3 px-6 text-slate-600">{schoolClass.students} Students</td>
            <td className="py-3 px-6 text-right">
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className="p-2 rounded-md hover:bg-slate-200 transition-colors" 
                        aria-label={`Actions for ${schoolClass.name}`}
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen}
                    >
                        <MoreHorizontalIcon className="h-5 w-5 text-slate-500" />
                    </button>
                     {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-slate-200/80">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                                {canEdit && (
                                    <button onClick={() => { onEdit(schoolClass); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem">
                                        <PencilIcon className="w-4 h-4 mr-3" />
                                        Edit
                                    </button>
                                )}
                                {canDelete && (
                                    <button onClick={() => { onDelete(schoolClass); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50" role="menuitem">
                                        <TrashIcon className="w-4 h-4 mr-3" />
                                        Delete
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
