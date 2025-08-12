import React, { useState, useEffect } from 'react';
import { Timetable, TimetableSlot, SchoolDay, Teacher, SchoolClass } from '../../types';
import { TimetablePDFExport } from './TimetablePDFExport';
import { 
  UserIcon, 
  UsersIcon, 
  ClockIcon, 
  DownloadIcon, 
  PrinterIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  EyeIcon
} from '../icons';

interface TeacherTimetableViewProps {
  teacher: Teacher;
  timetable: Timetable;
  schoolDays: SchoolDay[];
  assignedClass?: SchoolClass; // If teacher is a class teacher
}

export const TeacherTimetableView: React.FC<TeacherTimetableViewProps> = ({
  teacher,
  timetable,
  schoolDays,
  assignedClass
}) => {
  const [viewMode, setViewMode] = useState<'personal' | 'class'>('personal');
  const [showPDFExport, setShowPDFExport] = useState(false);

  // Get teacher's personal teaching schedule
  const getTeacherSlots = () => {
    return timetable.slots.filter(slot => slot.teacherId === teacher.id);
  };

  // Get class timetable if teacher is a class teacher
  const getClassSlots = () => {
    if (!assignedClass) return [];
    return timetable.slots.filter(slot => slot.classId === assignedClass.id);
  };

  const teacherSlots = getTeacherSlots();
  const classSlots = getClassSlots();
  const isClassTeacher = !!assignedClass;

  // Get teaching periods for each day
  const getTeachingPeriods = (day: SchoolDay) => {
    return day.periods.filter(period => period.type === 'Teaching');
  };

  // Find slot for specific day and period based on current view
  const findSlot = (day: string, periodId: string): TimetableSlot | null => {
    const slots = viewMode === 'personal' ? teacherSlots : classSlots;
    return slots.find(slot => 
      slot.day === day && slot.periodId === periodId
    ) || null;
  };

  const activeDays = schoolDays.filter(day => day.isActive);

  // Get all unique periods across all days
  const allPeriods = activeDays.reduce((periods, day) => {
    const teachingPeriods = getTeachingPeriods(day);
    teachingPeriods.forEach(period => {
      if (!periods.find(p => p.id === period.id)) {
        periods.push(period);
      }
    });
    return periods;
  }, [] as any[]);

  const renderSlotContent = (slot: TimetableSlot) => {
    const isCurrentTeacher = slot.teacherId === teacher.id;
    
    return (
      <div className={`
        p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200
        ${isCurrentTeacher 
          ? 'bg-indigo-100 border-indigo-300 text-indigo-900' 
          : 'bg-gray-100 border-gray-300 text-gray-800'
        }
        ${viewMode === 'personal' && !isCurrentTeacher ? 'opacity-50' : ''}
      `}>
        {viewMode === 'personal' ? (
          // Personal view - show subject and class
          <>
            <div className="flex items-center mb-1">
              <BookOpenIcon className="h-4 w-4 mr-2" />
              <span className="font-semibold truncate">{slot.subjectId}</span>
            </div>
            <div className="flex items-center text-xs text-indigo-700">
              <UsersIcon className="h-3 w-3 mr-1" />
              <span className="truncate">{slot.classId}</span>
            </div>
            {slot.roomId && (
              <div className="text-xs text-indigo-600 mt-1">
                Room: {slot.roomId}
              </div>
            )}
          </>
        ) : (
          // Class view - show subject and teacher
          <>
            <div className="flex items-center mb-1">
              <BookOpenIcon className="h-4 w-4 mr-2" />
              <span className="font-semibold truncate">{slot.subjectId}</span>
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <UserIcon className="h-3 w-3 mr-1" />
              <span className="truncate">{slot.teacherId}</span>
            </div>
            {slot.roomId && (
              <div className="text-xs text-gray-500 mt-1">
                Room: {slot.roomId}
              </div>
            )}
          </>
        )}
        
        {slot.isExam && (
          <div className="text-xs font-bold text-red-600 mt-1">
            EXAM
          </div>
        )}
        
        {slot.isDoublePeriod && (
          <div className="text-xs font-medium text-purple-600 mt-1">
            Double Period
          </div>
        )}
      </div>
    );
  };

  const renderEmptySlot = () => {
    return (
      <div className="p-3 min-h-[80px] border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-sm">Free Period</span>
      </div>
    );
  };

  const getStatistics = () => {
    const currentSlots = viewMode === 'personal' ? teacherSlots : classSlots;
    const totalPeriods = allPeriods.length * activeDays.length;
    const scheduledPeriods = currentSlots.length;
    const freePeriodsCount = totalPeriods - scheduledPeriods;
    
    // Group by subjects for teaching load
    const subjectCounts = currentSlots.reduce((acc, slot) => {
      acc[slot.subjectId] = (acc[slot.subjectId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPeriods,
      scheduledPeriods,
      freePeriodsCount,
      subjectCounts,
      utilizationRate: totalPeriods > 0 ? Math.round((scheduledPeriods / totalPeriods) * 100) : 0
    };
  };

  const stats = getStatistics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <UserIcon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {teacher.firstName} {teacher.lastName}
              </h2>
              <p className="text-indigo-100 mt-1">
                {isClassTeacher ? `Class Teacher - ${assignedClass?.name}` : 'Subject Teacher'}
              </p>
              <div className="flex items-center mt-2 text-sm">
                <CalendarDaysIcon className="h-4 w-4 mr-2" />
                <span>{timetable.academicYear} - {timetable.term}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPDFExport(true)}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition"
            >
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export PDF
            </button>
            
            <button
              onClick={() => window.print()}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Selector (Only for Class Teachers) */}
      {isClassTeacher && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Timetable View</h3>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('personal')}
                className={`
                  flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${viewMode === 'personal' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <UserIcon className="h-4 w-4 mr-2" />
                My Teaching Schedule
              </button>
              
              <button
                onClick={() => setViewMode('class')}
                className={`
                  flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${viewMode === 'class' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <UsersIcon className="h-4 w-4 mr-2" />
                {assignedClass?.name} Timetable
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {viewMode === 'personal' ? (
              <p>Your personal teaching schedule showing all the classes you teach across different forms.</p>
            ) : (
              <p>The complete timetable for your assigned class showing all subjects and teachers.</p>
            )}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Periods</p>
              <p className="text-2xl font-bold text-gray-900">{stats.scheduledPeriods}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <EyeIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilization</p>
              <p className="text-2xl font-bold text-gray-900">{stats.utilizationRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <BookOpenIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Subjects</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.subjectCounts).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
              <CalendarDaysIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Free Periods</p>
              <p className="text-2xl font-bold text-gray-900">{stats.freePeriodsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Jafasol Unique Timetable Design */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Timetable Header */}
        <div className="bg-gradient-to-r from-gray-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {viewMode === 'personal' 
                  ? `${teacher.firstName}'s Teaching Schedule` 
                  : `${assignedClass?.name} Class Timetable`
                }
              </h3>
              <p className="text-gray-600 mt-1">
                {timetable.name} • Week View
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">Academic Year</div>
              <div className="font-semibold text-indigo-600">
                {timetable.academicYear} - {timetable.term}
              </div>
            </div>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Days Header with Jafasol Branding */}
            <div className="grid grid-cols-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <div className="p-4 font-bold text-center border-r border-white border-opacity-20">
                <div className="text-lg">⏰</div>
                <div className="text-sm mt-1">Time</div>
              </div>
              {activeDays.map(day => (
                <div key={day.day} className="p-4 font-bold text-center border-r border-white border-opacity-20 last:border-r-0">
                  <div className="text-lg mb-1">
                    {day.day.substring(0, 3).toUpperCase()}
                  </div>
                  <div className="text-xs opacity-90">
                    {day.day}
                  </div>
                </div>
              ))}
            </div>

            {/* Periods Grid */}
            {allPeriods.map((period, periodIndex) => (
              <div key={period.id} className={`
                grid grid-cols-6 border-b border-gray-200 last:border-b-0
                ${periodIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              `}>
                {/* Time Column with Enhanced Design */}
                <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-50 border-r border-gray-200">
                  <div className="text-center">
                    <div className="font-bold text-gray-900 text-lg">
                      {period.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {period.startTime} - {period.endTime}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {period.duration} min
                    </div>
                  </div>
                </div>

                {/* Day Columns */}
                {activeDays.map(day => {
                  const dayHasPeriod = getTeachingPeriods(day).some(p => p.id === period.id);
                  
                  if (!dayHasPeriod) {
                    return (
                      <div key={`${day.day}-${period.id}`} className="p-4 bg-gray-100 border-r border-gray-200 last:border-r-0">
                        <div className="text-center text-gray-400 text-sm">N/A</div>
                      </div>
                    );
                  }

                  const slot = findSlot(day.day, period.id);
                  
                  return (
                    <div key={`${day.day}-${period.id}`} className="p-3 border-r border-gray-200 last:border-r-0">
                      {slot ? renderSlotContent(slot) : renderEmptySlot()}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Jafasol Branding */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-indigo-200 rounded"></div>
                <span className="text-gray-600">Teaching Periods</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-dashed border-gray-300 rounded"></div>
                <span className="text-gray-600">Free Periods</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-200 rounded"></div>
                <span className="text-gray-600">Exam Periods</span>
              </div>
            </div>
            
            <div className="text-gray-500">
              Generated by <span className="font-semibold text-indigo-600">Jafasol School Management System</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Distribution (for personal view) */}
      {viewMode === 'personal' && Object.keys(stats.subjectCounts).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Teaching Load Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.subjectCounts).map(([subject, count]) => (
              <div key={subject} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{subject}</span>
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm font-medium">
                    {count} periods
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF Export Modal */}
      {showPDFExport && (
        <TimetablePDFExport
          title={viewMode === 'personal' 
            ? `${teacher.firstName} ${teacher.lastName} - Teaching Schedule` 
            : `${assignedClass?.name} - Class Timetable`
          }
          timetable={timetable}
          schoolDays={activeDays}
          slots={viewMode === 'personal' ? teacherSlots : classSlots}
          viewMode={viewMode}
          teacherName={`${teacher.firstName} ${teacher.lastName}`}
          className={assignedClass?.name}
          onClose={() => setShowPDFExport(false)}
        />
      )}
    </div>
  );
};



