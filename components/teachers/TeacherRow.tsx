

import React, { useState, useRef, useEffect } from 'react';
import { Teacher, User, Page } from '../../types';
import { 
  MoreHorizontalIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  UserIcon, 
  AcademicsIcon, 
  PhoneIcon, 
  CalendarDaysIcon,
  ShieldCheckIcon,
  ClockIcon,
  GraduationCapIcon,
  UsersIcon,
  BookOpenIcon
} from '../icons';

interface TeacherRowProps {
  teacher: Teacher;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacherId: string) => void;
  currentUser: User;
}

export const TeacherRow: React.FC<TeacherRowProps> = ({ teacher, onEdit, onDelete, currentUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Permission checks - Ensure Admin always has access
  const isAdmin = currentUser?.role?.name === 'Admin';
  const canEdit = isAdmin || currentUser?.role?.permissions?.[Page.Teachers]?.edit || false;
  const canDelete = isAdmin || currentUser?.role?.permissions?.[Page.Teachers]?.delete || false;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${teacher.firstName} ${teacher.lastName}?`)) {
      onDelete(teacher.id);
      setIsMenuOpen(false);
    }
  };

  const statusColors = {
    'Active': 'bg-green-100 text-green-800',
    'Inactive': 'bg-gray-100 text-gray-800',
    'On-leave': 'bg-yellow-100 text-yellow-800',
    'Retired': 'bg-red-100 text-red-800'
  };

  const roleBadges = [];
  if (teacher.isClassTeacher) {
    roleBadges.push(
      <span key="class" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1">
        <UsersIcon className="h-3 w-3 mr-1" />
        Class Teacher
      </span>
    );
  }
  if (teacher.isSubjectTeacher) {
    roleBadges.push(
      <span key="subject" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        <BookOpenIcon className="h-3 w-3 mr-1" />
        Subject Teacher
      </span>
    );
  }

  return (
    <>
      <tr className="border-b border-slate-200 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-200">
        <td className="py-4 px-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-sm font-bold text-white">
                {teacher.firstName?.[0]?.toUpperCase()}{teacher.lastName?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="ml-4">
              <p className="font-semibold text-slate-800 text-lg">{teacher.firstName} {teacher.lastName}</p>
              <p className="text-sm text-slate-500 font-mono">{teacher.teacherId}</p>
              <div className="flex items-center mt-1">
                {roleBadges}
              </div>
            </div>
          </div>
        </td>
        
        <td className="py-4 px-6">
          <div className="space-y-2">
            {teacher.isClassTeacher && teacher.assignedClass && (
              <div className="flex items-center">
                <UsersIcon className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-slate-700">
                  Class: {typeof teacher.assignedClass === 'string' ? teacher.assignedClass : teacher.assignedClass.name}
                </span>
              </div>
            )}
            {teacher.isSubjectTeacher && teacher.subjects && teacher.subjects.length > 0 && (
              <div className="flex items-center">
                <BookOpenIcon className="h-4 w-4 text-purple-600 mr-2" />
                <span className="text-sm text-slate-600">
                  {teacher.subjects.length} subject{teacher.subjects.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            {teacher.qualification && (
              <div className="flex items-center">
                <GraduationCapIcon className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-slate-600">{teacher.qualification}</span>
              </div>
            )}
          </div>
        </td>
        
        <td className="py-4 px-6">
          <div className="space-y-1">
            <div className="flex items-center">
              <span className="text-sm text-slate-700">{teacher.email}</span>
            </div>
            {teacher.phone && (
              <div className="flex items-center">
                <PhoneIcon className="h-4 w-4 text-slate-500 mr-2" />
                <span className="text-sm text-slate-600">{teacher.phone}</span>
              </div>
            )}
          </div>
        </td>
        
        <td className="py-4 px-6">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[teacher.status]}`}>
            {teacher.status}
          </span>
        </td>
        
        <td className="py-4 px-6">
          <div className="flex items-center justify-end space-x-2">
            {/* View Details Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all duration-200 group"
              title="View Details"
            >
              <EyeIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </button>

            {/* Edit Button */}
            {canEdit && (
              <button
                onClick={() => onEdit(teacher)}
                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-800 transition-all duration-200 group"
                title="Edit Teacher"
              >
                <PencilIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </button>
            )}

            {/* Delete Button */}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 transition-all duration-200 group"
                title="Delete Teacher"
              >
                <TrashIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Expandable Details Row */}
      {showDetails && (
        <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
          <td colSpan={5} className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <UserIcon className="h-4 w-4 mr-2 text-blue-600" />
                  Personal Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <CalendarDaysIcon className="h-4 w-4 text-slate-500 mr-2" />
                    <span className="text-slate-600">Age: {teacher.dateOfBirth ? Math.floor((new Date().getTime() - new Date(teacher.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A'} years</span>
                  </div>
                  <div className="flex items-center">
                    <ShieldCheckIcon className="h-4 w-4 text-slate-500 mr-2" />
                    <span className="text-slate-600">Gender: {teacher.gender || 'N/A'}</span>
                  </div>
                  {teacher.address && (
                    <div className="flex items-center">
                      <span className="text-slate-600">{teacher.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <AcademicsIcon className="h-4 w-4 mr-2 text-green-600" />
                  Professional Info
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-slate-500 mr-2" />
                    <span className="text-slate-600">Experience: {teacher.experience || 0} years</span>
                  </div>
                  {teacher.qualification && (
                    <div className="flex items-center">
                      <GraduationCapIcon className="h-4 w-4 text-slate-500 mr-2" />
                      <span className="text-slate-600">{teacher.qualification}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <CalendarDaysIcon className="h-4 w-4 text-slate-500 mr-2" />
                    <span className="text-slate-600">Status: {teacher.status}</span>
                  </div>
                </div>
              </div>

              {/* Teaching Assignments */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <BookOpenIcon className="h-4 w-4 mr-2 text-purple-600" />
                  Teaching Assignments
                </h4>
                <div className="space-y-2 text-sm">
                  {teacher.isClassTeacher && teacher.assignedClass && (
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-slate-600">
                        Class: {typeof teacher.assignedClass === 'string' ? teacher.assignedClass : teacher.assignedClass.name}
                      </span>
                    </div>
                  )}
                  {teacher.isSubjectTeacher && teacher.subjects && teacher.subjects.length > 0 && (
                    <div>
                      <div className="flex items-center mb-1">
                        <BookOpenIcon className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="text-slate-600">Subjects:</span>
                      </div>
                      <div className="ml-6">
                        {teacher.subjects.map((subject, index) => (
                          <div key={index} className="text-xs text-slate-500">
                            • {typeof subject === 'string' ? subject : subject.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
