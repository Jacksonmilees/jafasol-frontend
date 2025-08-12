import React, { useState, useEffect } from 'react';
import { Timetable, TimetableSlot, SchoolDay, Subject, SchoolClass, Teacher, User } from '../../types';
import { TimetableGrid } from './TimetableGrid';
import { TimetableGenerator } from './TimetableGenerator';
import { TimetableConflicts } from './TimetableConflicts';
import { TeacherTimetableView } from './TeacherTimetableView';
import { 
  CalendarDaysIcon, 
  PlusIcon, 
  Wand2Icon, 
  EyeIcon, 
  PencilIcon,
  TrashIcon,
  DownloadIcon,
  PrinterIcon,
  MoreHorizontalIcon,
  ClockIcon,
  UserIcon,
  UsersIcon,
  BookOpenIcon,
  SettingsIcon
} from '../icons';

interface TimetableManagementProps {
  subjects: Subject[];
  classes: SchoolClass[];
  teachers: Teacher[];
  academicYear: string;
  term: string;
  currentUser?: User;
}

export const TimetableManagement: React.FC<TimetableManagementProps> = ({
  subjects,
  classes,
  teachers,
  academicYear,
  term,
  currentUser
}) => {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [schoolDays, setSchoolDays] = useState<SchoolDay[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null);
  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'subject'>('class');
  const [selectedId, setSelectedId] = useState<string>('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [showConflicts, setShowConflicts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'admin' | 'teacher'>('admin');

  // Check if current user is a teacher
  const currentTeacher = currentUser ? teachers.find(teacher => teacher.userId === currentUser.id) : null;
  const isTeacher = !!currentTeacher;
  const teacherAssignedClass = isTeacher ? classes.find(cls => cls.classTeacher === currentTeacher?.id) : null;

  // Show loading if no user data
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading user data...</span>
      </div>
    );
  }

  useEffect(() => {
    loadData();
    // Set initial view based on user role
    if (isTeacher) {
      setCurrentView('teacher');
    }
  }, [academicYear, term, isTeacher]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load timetables, school days, etc.
      // This would call your API
      await loadTimetables();
      await loadSchoolDays();
    } catch (error) {
      console.error('Error loading timetable data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTimetables = async () => {
    // API call to load timetables
    // For now, mock data
    const mockTimetables: Timetable[] = [
      {
        id: '1',
        name: `Teaching Timetable - ${term} ${academicYear}`,
        academicYear,
        term,
        type: 'Teaching',
        status: 'Active',
        slots: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    setTimetables(mockTimetables);
    setSelectedTimetable(mockTimetables[0]);
  };

  const loadSchoolDays = async () => {
    // API call to load school days
    // For now, mock data
    const mockSchoolDays: SchoolDay[] = [
      {
        day: 'Monday',
        periods: [
          { id: '1', name: 'Period 1', startTime: '08:00', endTime: '08:40', duration: 40, type: 'Teaching' },
          { id: '2', name: 'Period 2', startTime: '08:40', endTime: '09:20', duration: 40, type: 'Teaching' },
          { id: 'break1', name: 'Break', startTime: '09:20', endTime: '09:40', duration: 20, type: 'Break' },
          { id: '3', name: 'Period 3', startTime: '09:40', endTime: '10:20', duration: 40, type: 'Teaching' },
          { id: '4', name: 'Period 4', startTime: '10:20', endTime: '11:00', duration: 40, type: 'Teaching' },
          { id: '5', name: 'Period 5', startTime: '11:00', endTime: '11:40', duration: 40, type: 'Teaching' },
          { id: 'lunch', name: 'Lunch', startTime: '11:40', endTime: '12:40', duration: 60, type: 'Lunch' },
          { id: '6', name: 'Period 6', startTime: '12:40', endTime: '13:20', duration: 40, type: 'Teaching' },
          { id: '7', name: 'Period 7', startTime: '13:20', endTime: '14:00', duration: 40, type: 'Teaching' }
        ]
      }
      // Add other days...
    ];
    setSchoolDays(mockSchoolDays);
  };

  const handleGenerateTimetable = async (settings: any) => {
    setIsLoading(true);
    try {
      // Call timetable generation API
      console.log('Generating timetable with settings:', settings);
      // The actual implementation would call the TimetableGenerator service
      setShowGenerator(false);
    } catch (error) {
      console.error('Error generating timetable:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotClick = (slot: TimetableSlot) => {
    console.log('Slot clicked:', slot);
    // Open slot details modal
  };

  const handleSlotEdit = (slot: TimetableSlot) => {
    console.log('Slot edited:', slot);
    // Update the slot in the timetable
  };

  const handleSlotDelete = (slot: TimetableSlot) => {
    console.log('Slot deleted:', slot);
    // Remove the slot from the timetable
  };

  const getViewModeOptions = () => {
    switch (viewMode) {
      case 'class':
        return classes.map(c => ({ id: c.id, name: c.name }));
      case 'teacher':
        return teachers.map(t => ({ id: t.id, name: `${t.firstName} ${t.lastName}` }));
      case 'subject':
        return subjects.map(s => ({ id: s.id, name: s.name }));
      default:
        return [];
    }
  };

  const getViewModeIcon = () => {
    switch (viewMode) {
      case 'class':
        return <UsersIcon className="h-4 w-4" />;
      case 'teacher':
        return <UserIcon className="h-4 w-4" />;
      case 'subject':
        return <BookOpenIcon className="h-4 w-4" />;
      default:
        return <CalendarDaysIcon className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading timetables...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Timetable Management</h2>
          <p className="text-gray-600 mt-1">
            Manage teaching and exam timetables for {academicYear} - {term}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Toggle for Teachers with Admin Access */}
          {isTeacher && currentUser?.role && currentUser.role !== 'teacher' && (
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('teacher')}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${currentView === 'teacher' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <UserIcon className="h-4 w-4 mr-2" />
                Teacher View
              </button>
              
              <button
                onClick={() => setCurrentView('admin')}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${currentView === 'admin' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <SettingsIcon className="h-4 w-4 mr-2" />
                Admin View
              </button>
            </div>
          )}

          {/* Admin Controls */}
          {(!isTeacher || currentView === 'admin') && (
            <>
              <button
                onClick={() => setShowGenerator(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
              >
                <Wand2Icon className="h-4 w-4 mr-2" />
                Generate Timetable
              </button>
              
              <button
                onClick={() => {/* Create new timetable */}}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                New Timetable
              </button>
            </>
          )}
        </div>
      </div>

      {/* Timetable Selector and Controls */}
      {(!isTeacher || currentView === 'admin') && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Timetable
              </label>
              <select
                value={selectedTimetable?.id || ''}
                onChange={(e) => {
                  const timetable = timetables.find(t => t.id === e.target.value);
                  setSelectedTimetable(timetable || null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white min-w-[200px]"
              >
                {timetables.map(timetable => (
                  <option key={timetable.id} value={timetable.id}>
                    {timetable.name} ({timetable.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <select
                value={viewMode}
                onChange={(e) => {
                  setViewMode(e.target.value as any);
                  setSelectedId('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="class">By Class</option>
                <option value="teacher">By Teacher</option>
                <option value="subject">By Subject</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {viewMode === 'class' ? 'Select Class' : 
                 viewMode === 'teacher' ? 'Select Teacher' : 'Select Subject'}
              </label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white min-w-[200px]"
              >
                <option value="">All {viewMode}s</option>
                {getViewModeOptions().map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {selectedTimetable && (selectedTimetable.conflicts?.length || 0) > 0 && (
              <button
                onClick={() => setShowConflicts(true)}
                className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition"
              >
                <ClockIcon className="h-4 w-4 mr-2" />
                {selectedTimetable.conflicts?.length || 0} Conflicts
              </button>
            )}

            <button
              onClick={() => {/* Export timetable */}}
              className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </button>

            <button
              onClick={() => {/* Print timetable */}}
              className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </button>
          </div>
        </div>

        {/* Timetable Statistics */}
        {selectedTimetable && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-900">Total Periods</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedTimetable.slots?.length || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-900">Completion</p>
                  <p className="text-2xl font-bold text-green-600">{selectedTimetable.statistics?.completionPercentage || 0}%</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <UserIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-900">Teachers</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set((selectedTimetable.slots || []).map(s => s.teacherId)).size}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <MoreHorizontalIcon className="h-8 w-8 text-red-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-900">Conflicts</p>
                  <p className="text-2xl font-bold text-red-600">{selectedTimetable.conflicts?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Teacher View */}
      {isTeacher && currentView === 'teacher' && selectedTimetable && currentTeacher && (
        <TeacherTimetableView
          teacher={currentTeacher}
          timetable={selectedTimetable}
          schoolDays={schoolDays}
          assignedClass={teacherAssignedClass}
        />
      )}

      {/* Admin/Management View */}
      {(!isTeacher || currentView === 'admin') && selectedTimetable && (
        <TimetableGrid
          timetable={selectedTimetable}
          schoolDays={schoolDays}
          viewMode={viewMode}
          selectedId={selectedId}
          onSlotClick={handleSlotClick}
          onSlotEdit={handleSlotEdit}
          onSlotDelete={handleSlotDelete}
          isEditable={selectedTimetable.status === 'Draft'}
        />
      )}

      {/* No Timetables */}
      {timetables.length === 0 && (
        <div className="text-center py-12">
          <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Timetables Found</h3>
          <p className="text-gray-500 mb-6">Create your first timetable to get started.</p>
          <button
            onClick={() => setShowGenerator(true)}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            <Wand2Icon className="h-5 w-5 mr-2" />
            Generate Timetable
          </button>
        </div>
      )}

      {/* Modals */}
      {showGenerator && (
        <TimetableGenerator
          subjects={subjects}
          classes={classes}
          teachers={teachers}
          academicYear={academicYear}
          term={term}
          onGenerate={handleGenerateTimetable}
          onClose={() => setShowGenerator(false)}
        />
      )}

      {showConflicts && selectedTimetable && (
        <TimetableConflicts
          timetable={selectedTimetable}
          onClose={() => setShowConflicts(false)}
          onResolve={(conflictId) => {
            // Handle conflict resolution
            console.log('Resolving conflict:', conflictId);
          }}
        />
      )}
    </div>
  );
};
