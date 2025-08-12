import React, { useState, useRef, useEffect } from 'react';
import { Subject, User, Page } from '../../types';
import { MoreHorizontalIcon, PencilIcon, TrashIcon, ClockIcon, UserIcon } from '../icons';

interface SubjectRowProps {
    subject: Subject;
    onEdit: (subject: Subject) => void;
    onDelete: (subject: Subject) => void;
    currentUser: User;
}

export const SubjectRow: React.FC<SubjectRowProps> = ({ subject, onEdit, onDelete, currentUser }) => {
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

    const canEdit = currentUser?.role?.permissions?.[Page.Academics]?.edit;
    const canDelete = currentUser?.role?.permissions?.[Page.Academics]?.delete;

    const getDifficultyColor = (level: string) => {
        switch (level) {
            case 'Low': return 'text-green-600 bg-green-100';
            case 'Medium': return 'text-yellow-600 bg-yellow-100';
            case 'High': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Core': return 'text-blue-600 bg-blue-100';
            case 'Science': return 'text-purple-600 bg-purple-100';
            case 'Arts': return 'text-pink-600 bg-pink-100';
            case 'Language': return 'text-indigo-600 bg-indigo-100';
            case 'Mathematics': return 'text-orange-600 bg-orange-100';
            case 'Physical Education': return 'text-green-600 bg-green-100';
            case 'Technical': return 'text-gray-600 bg-gray-100';
            case 'Optional': return 'text-cyan-600 bg-cyan-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            {/* Subject Info */}
            <td className="py-4 px-6">
                <div className="flex flex-col">
                    <div className="flex items-center space-x-3">
                        <div>
                            <p className="font-semibold text-slate-800">{subject.name}</p>
                            <p className="text-sm text-slate-500">{subject.code}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(subject.subjectCategory)}`}>
                            {subject.subjectCategory}
                        </span>
                    </div>
                    {subject.description && (
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{subject.description}</p>
                    )}
                </div>
            </td>

            {/* Curriculum & Levels */}
            <td className="py-4 px-6">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-slate-700">{subject.curriculum}</p>
                    <p className="text-xs text-slate-500">{subject.formLevels?.slice(0, 3).join(', ')}{(subject.formLevels?.length || 0) > 3 ? '...' : ''}</p>
                </div>
            </td>

            {/* Timetable Info */}
            <td className="py-4 px-6">
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                            {subject.periodsPerWeek}x{subject.periodDuration}min/week
                        </span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(subject.difficultyLevel)}`}>
                        {subject.difficultyLevel} Difficulty
                    </span>
                </div>
            </td>

            {/* Teachers */}
            <td className="py-4 px-6">
                <div className="flex items-center space-x-1">
                    <UserIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                        {subject.assignedTeachers?.length || 0} teacher{(subject.assignedTeachers?.length || 0) !== 1 ? 's' : ''}
                    </span>
                </div>
            </td>

            {/* Status */}
            <td className="py-4 px-6">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    subject.status === 'Active' 
                        ? 'text-green-700 bg-green-100' 
                        : 'text-red-700 bg-red-100'
                }`}>
                    {subject.status}
                </span>
            </td>

            {/* Actions */}
            <td className="py-4 px-6 text-right relative">
                <div ref={menuRef}>
                    <button 
                        className="p-2 rounded-md hover:bg-slate-200 transition-colors" 
                        aria-label={`Actions for ${subject.name}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <MoreHorizontalIcon className="h-5 w-5 text-slate-500" />
                    </button>
                    
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-slate-200/80">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                                {canEdit && (
                                    <button 
                                        onClick={() => { 
                                            onEdit(subject); 
                                            setIsMenuOpen(false); 
                                        }} 
                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" 
                                        role="menuitem"
                                    >
                                        <PencilIcon className="w-4 h-4 mr-3" />
                                        Edit Subject
                                    </button>
                                )}
                                {canDelete && (
                                    <button 
                                        onClick={() => { 
                                            onDelete(subject); 
                                            setIsMenuOpen(false); 
                                        }} 
                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50" 
                                        role="menuitem"
                                    >
                                        <TrashIcon className="w-4 h-4 mr-3" />
                                        Delete Subject
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
