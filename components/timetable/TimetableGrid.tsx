import React, { useState, useRef, useEffect } from 'react';
import { Timetable, TimetableSlot, Period, SchoolDay } from '../../types';
import { CalendarDaysIcon, ClockIcon, UsersIcon, UserIcon, BookOpenIcon } from '../icons';

interface TimetableGridProps {
  timetable: Timetable;
  schoolDays: SchoolDay[];
  viewMode: 'class' | 'teacher' | 'subject';
  selectedId?: string; // ID of selected class, teacher, or subject
  onSlotClick?: (slot: TimetableSlot) => void;
  onSlotEdit?: (slot: TimetableSlot) => void;
  onSlotDelete?: (slot: TimetableSlot) => void;
  isEditable?: boolean;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  timetable,
  schoolDays,
  viewMode,
  selectedId,
  onSlotClick,
  onSlotEdit,
  onSlotDelete,
  isEditable = false
}) => {
  const [draggedSlot, setDraggedSlot] = useState<TimetableSlot | null>(null);
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Filter slots based on view mode and selected ID
  const getFilteredSlots = () => {
    if (!selectedId) return timetable.slots;
    
    switch (viewMode) {
      case 'class':
        return timetable.slots.filter(slot => slot.classId === selectedId);
      case 'teacher':
        return timetable.slots.filter(slot => slot.teacherId === selectedId);
      case 'subject':
        return timetable.slots.filter(slot => slot.subjectId === selectedId);
      default:
        return timetable.slots;
    }
  };

  const filteredSlots = getFilteredSlots();

  // Get teaching periods for each day
  const getTeachingPeriods = (day: SchoolDay) => {
    return day.periods.filter(period => period.type === 'Teaching');
  };

  // Find slot for specific day and period
  const findSlot = (day: string, periodId: string): TimetableSlot | null => {
    return filteredSlots.find(slot => 
      slot.day === day && slot.periodId === periodId
    ) || null;
  };

  // Get all unique days from school days
  const activeDays = schoolDays.filter(day => day.isActive);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, slot: TimetableSlot) => {
    if (!isEditable) return;
    setDraggedSlot(slot);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, day: string, periodId: string) => {
    if (!isEditable || !draggedSlot) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCell(`${day}-${periodId}`);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, day: string, periodId: string) => {
    if (!isEditable || !draggedSlot) return;
    e.preventDefault();
    
    // Update slot position
    const updatedSlot = {
      ...draggedSlot,
      day,
      periodId
    };
    
    // Call edit handler if provided
    if (onSlotEdit) {
      onSlotEdit(updatedSlot);
    }
    
    setDraggedSlot(null);
    setDragOverCell(null);
  };

  // Get period time display
  const getPeriodTimeDisplay = (period: Period) => {
    return `${period.startTime} - ${period.endTime}`;
  };

  // Get slot background color based on type and conflicts
  const getSlotColor = (slot: TimetableSlot) => {
    if (slot.isExam) {
      return 'bg-red-100 border-red-300 text-red-800';
    }
    
    // You could add logic here to color by subject category, difficulty, etc.
    switch (viewMode) {
      case 'class':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'teacher':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'subject':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  // Check if there are conflicts in this slot
  const hasConflict = (slot: TimetableSlot) => {
    return timetable.conflicts.some(conflict => 
      conflict.slotIds.includes(slot.id) && !conflict.resolved
    );
  };

  const renderSlotContent = (slot: TimetableSlot) => {
    const hasConflictFlag = hasConflict(slot);
    
    return (
      <div 
        className={`
          relative p-2 rounded-lg border-2 cursor-pointer transition-all duration-200 text-xs
          ${getSlotColor(slot)}
          ${hasConflictFlag ? 'ring-2 ring-red-500 ring-opacity-50' : ''}
          ${isEditable ? 'hover:shadow-md' : ''}
        `}
        draggable={isEditable}
        onDragStart={(e) => handleDragStart(e, slot)}
        onClick={() => onSlotClick && onSlotClick(slot)}
        title={`${slot.subjectId} - ${slot.classId} - ${slot.teacherId}`}
      >
        {hasConflictFlag && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full -mt-1 -mr-1"></div>
        )}
        
        <div className="font-medium truncate mb-1">
          {/* Display different info based on view mode */}
          {viewMode === 'class' && (
            <>
              <div className="flex items-center">
                <BookOpenIcon className="h-3 w-3 mr-1" />
                {slot.subjectId}
              </div>
              <div className="flex items-center text-xs opacity-75">
                <UserIcon className="h-3 w-3 mr-1" />
                {slot.teacherId}
              </div>
            </>
          )}
          
          {viewMode === 'teacher' && (
            <>
              <div className="flex items-center">
                <BookOpenIcon className="h-3 w-3 mr-1" />
                {slot.subjectId}
              </div>
              <div className="flex items-center text-xs opacity-75">
                <UsersIcon className="h-3 w-3 mr-1" />
                {slot.classId}
              </div>
            </>
          )}
          
          {viewMode === 'subject' && (
            <>
              <div className="flex items-center">
                <UsersIcon className="h-3 w-3 mr-1" />
                {slot.classId}
              </div>
              <div className="flex items-center text-xs opacity-75">
                <UserIcon className="h-3 w-3 mr-1" />
                {slot.teacherId}
              </div>
            </>
          )}
        </div>
        
        {slot.isExam && (
          <div className="text-xs font-bold text-red-600">
            EXAM
          </div>
        )}
        
        {slot.isDoublePeriod && (
          <div className="text-xs font-medium text-indigo-600">
            Double Period
          </div>
        )}
      </div>
    );
  };

  const renderEmptySlot = (day: string, period: Period) => {
    const cellId = `${day}-${period.id}`;
    const isDragOver = dragOverCell === cellId;
    
    return (
      <div 
        className={`
          p-2 min-h-[60px] border-2 border-dashed border-gray-200 rounded-lg transition-all duration-200
          ${isDragOver ? 'border-indigo-400 bg-indigo-50' : ''}
          ${isEditable ? 'hover:border-gray-300 hover:bg-gray-50' : ''}
        `}
        onDragOver={(e) => handleDragOver(e, day, period.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, day, period.id)}
      >
        {isDragOver && (
          <div className="text-center text-indigo-600 text-sm font-medium">
            Drop here
          </div>
        )}
      </div>
    );
  };

  if (activeDays.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No School Days Configured</h3>
        <p className="text-gray-500">Please configure school days and periods first.</p>
      </div>
    );
  }

  // Get all unique periods across all days for consistent grid
  const allPeriods = activeDays.reduce((periods, day) => {
    const teachingPeriods = getTeachingPeriods(day);
    teachingPeriods.forEach(period => {
      if (!periods.find(p => p.id === period.id)) {
        periods.push(period);
      }
    });
    return periods;
  }, [] as Period[]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CalendarDaysIcon className="h-6 w-6 text-indigo-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{timetable.name}</h3>
              <p className="text-sm text-gray-500">
                {timetable.academicYear} - {timetable.term} | {timetable.type} Timetable
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-200 rounded"></div>
              <span>Regular Classes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-200 rounded"></div>
              <span>Exams</span>
            </div>
            {timetable.conflicts?.length || 0 > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-600 font-medium">{timetable.conflicts?.length || 0} Conflicts</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div ref={gridRef} className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Days Header */}
          <div className="grid grid-cols-6 gap-px bg-gray-200">
            <div className="bg-gray-100 p-4 font-medium text-gray-900 text-center">
              Time
            </div>
            {activeDays.map(day => (
              <div key={day.day} className="bg-gray-100 p-4 font-medium text-gray-900 text-center">
                {day.day}
              </div>
            ))}
          </div>

          {/* Periods Grid */}
          {allPeriods.map(period => (
            <div key={period.id} className="grid grid-cols-6 gap-px bg-gray-200">
              {/* Time Column */}
              <div className="bg-white p-4 border-r border-gray-200">
                <div className="text-sm font-medium text-gray-900">{period.name}</div>
                <div className="text-xs text-gray-500 flex items-center mt-1">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  {getPeriodTimeDisplay(period)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {period.duration} min
                </div>
              </div>

              {/* Day Columns */}
              {activeDays.map(day => {
                const dayHasPeriod = getTeachingPeriods(day).some(p => p.id === period.id);
                
                if (!dayHasPeriod) {
                  return (
                    <div key={`${day.day}-${period.id}`} className="bg-gray-50 p-4">
                      <div className="text-center text-gray-400 text-xs">N/A</div>
                    </div>
                  );
                }

                const slot = findSlot(day.day, period.id);
                
                return (
                  <div key={`${day.day}-${period.id}`} className="bg-white p-2">
                    {slot ? renderSlotContent(slot) : renderEmptySlot(day.day, period)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <span>
              <strong>{filteredSlots.length}</strong> scheduled periods
            </span>
            <span>
              <strong>{timetable.statistics.completionPercentage}%</strong> complete
            </span>
            {timetable.conflicts?.length || 0 > 0 && (
              <span className="text-red-600">
                <strong>{timetable.conflicts?.length || 0}</strong> conflicts need resolution
              </span>
            )}
          </div>
          
          <div className="text-gray-500">
            Last updated: {new Date(timetable.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};
