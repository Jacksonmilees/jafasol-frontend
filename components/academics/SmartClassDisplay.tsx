import React, { useState } from 'react';
import { SchoolClass, Teacher } from '../../types';
import { ChevronDownIcon, ChevronRightIcon, UsersIcon, GraduationCapIcon, PencilIcon, TrashIcon } from '../icons';

interface SmartClassDisplayProps {
  classes: SchoolClass[];
  teachers: Teacher[];
  onEditClass: (classData: SchoolClass) => void;
  onDeleteClass: (classData: SchoolClass) => void;
}

interface GroupedClasses {
  [formLevel: string]: SchoolClass[];
}

export const SmartClassDisplay: React.FC<SmartClassDisplayProps> = ({ 
  classes, 
  teachers, 
  onEditClass, 
  onDeleteClass 
}) => {
  const [expandedForms, setExpandedForms] = useState<Set<string>>(new Set());

  // Group classes by form level
  const groupedClasses: GroupedClasses = classes.reduce((acc, classItem) => {
    const formLevel = classItem.formLevel;
    if (!acc[formLevel]) {
      acc[formLevel] = [];
    }
    acc[formLevel].push(classItem);
    return acc;
  }, {} as GroupedClasses);

  // Sort form levels intelligently
  const sortedFormLevels = Object.keys(groupedClasses).sort((a, b) => {
    // Extract numbers for intelligent sorting
    const getNumber = (str: string) => {
      const match = str.match(/\d+/);
      return match ? parseInt(match[0]) : 999;
    };
    
    const aNum = getNumber(a);
    const bNum = getNumber(b);
    
    if (aNum !== bNum) return aNum - bNum;
    return a.localeCompare(b);
  });

  const toggleFormExpansion = (formLevel: string) => {
    const newExpanded = new Set(expandedForms);
    if (newExpanded.has(formLevel)) {
      newExpanded.delete(formLevel);
    } else {
      newExpanded.add(formLevel);
    }
    setExpandedForms(newExpanded);
  };

  const getTeacherName = (teacherId?: string | null) => {
    if (!teacherId) return null;
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : null;
  };

  const getTotalStudents = (formClasses: SchoolClass[]) => {
    return formClasses.reduce((total, cls) => total + (cls.students || 0), 0);
  };

  const getClassTeacherCount = (formClasses: SchoolClass[]) => {
    return formClasses.filter(cls => cls.classTeacherId).length;
  };

  if ((classes?.length || 0) === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <GraduationCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Created Yet</h3>
        <p className="text-gray-500">Start by creating your first class using the "Add Class" button above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedFormLevels.map(formLevel => {
        const formClasses = groupedClasses[formLevel];
        const isExpanded = expandedForms.has(formLevel);
        const totalStudents = getTotalStudents(formClasses);
        const assignedTeachers = getClassTeacherCount(formClasses);

        return (
          <div key={formLevel} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Form Level Header */}
            <button
              onClick={() => toggleFormExpansion(formLevel)}
              className="w-full px-6 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 transition-colors text-left flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {isExpanded ? (
                    <ChevronDownIcon className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-indigo-600" />
                  )}
                  <h3 className="text-xl font-semibold text-gray-900">{formLevel}</h3>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1 text-blue-600">
                    <span className="font-medium">{formClasses.length}</span>
                    <span>Stream{formClasses.length !== 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-green-600">
                    <UsersIcon className="h-4 w-4" />
                    <span className="font-medium">{totalStudents}</span>
                    <span>Student{totalStudents !== 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-purple-600">
                    <GraduationCapIcon className="h-4 w-4" />
                    <span className="font-medium">{assignedTeachers}</span>
                    <span>Teacher{assignedTeachers !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Click to {isExpanded ? 'collapse' : 'expand'}
              </div>
            </button>

            {/* Streams List */}
            {isExpanded && (
              <div className="border-t border-gray-100">
                {formClasses.map((classItem, index) => {
                  const teacherName = getTeacherName(classItem.classTeacherId);
                  
                  return (
                    <div 
                      key={classItem.id} 
                      className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                        index < formClasses.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          {/* Stream Name */}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-lg font-medium text-gray-900">{classItem.name}</h4>
                            <p className="text-sm text-gray-500">Stream: {classItem.stream}</p>
                          </div>

                          {/* Student Count */}
                          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                            <UsersIcon className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">
                              {classItem.students || 0} / {classItem.capacity || 50}
                            </span>
                          </div>

                          {/* Class Teacher */}
                          <div className="flex items-center space-x-2 min-w-0">
                            <GraduationCapIcon className="h-4 w-4 text-purple-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate">
                              {teacherName || 'No Teacher Assigned'}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onEditClass(classItem)}
                            className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                            title="Edit Class"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteClass(classItem)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete Class"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
