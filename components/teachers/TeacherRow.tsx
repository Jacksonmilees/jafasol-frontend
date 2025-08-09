

import React, { useState, useEffect, useRef } from 'react';
import { Teacher, User, Page } from '../../types';
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from '../icons';

interface TeacherRowProps {
  teacher: Teacher;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacherId: string) => void;
  currentUser: User;
}

export const TeacherRow: React.FC<TeacherRowProps> = ({ teacher, onEdit, onDelete, currentUser }) => {
  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    'On-leave': 'bg-yellow-100 text-yellow-800',
    Terminated: 'bg-red-100 text-red-800',
  } as const;

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
  }, []);

  const canEdit = currentUser.role.permissions[Page.Teachers]?.edit;
  const canDelete = currentUser.role.permissions[Page.Teachers]?.delete;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${teacher.name}?`)) {
      onDelete(teacher.id);
      setIsMenuOpen(false);
    }
  };

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
      <td className="py-3 px-6">
        <div className="flex items-center">
          <img className="h-9 w-9 rounded-full object-cover" src={teacher.avatarUrl} alt={teacher.name} />
          <div className="ml-3">
            <p className="font-semibold text-slate-800">{teacher.name}</p>
            <p className="text-xs text-slate-500">{teacher.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-6 text-slate-600">{teacher.subjects.join(', ')}</td>
      <td className="py-3 px-6 text-slate-600">{teacher.classes.join(', ')}</td>
      <td className="py-3 px-6">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[teacher.status]}`}>
          {teacher.status}
        </span>
      </td>
      <td className="py-3 px-6 text-right">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-slate-200 transition-colors"
            aria-label={`Actions for ${teacher.name}`}
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
          >
            <MoreHorizontalIcon className="h-5 w-5 text-slate-500" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-slate-200/80">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {canEdit && (
                  <button
                    onClick={() => {
                      onEdit(teacher);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    role="menuitem"
                  >
                    <PencilIcon className="w-4 h-4 mr-3" />
                    Edit Details
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    role="menuitem"
                  >
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
