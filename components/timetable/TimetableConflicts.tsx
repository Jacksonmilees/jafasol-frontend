import React, { useState } from 'react';
import { Timetable, TimetableConstraint } from '../../types';
import { XIcon, ClockIcon, UsersIcon, UserIcon, ShieldAlertIcon, MoreHorizontalIcon } from '../icons';

interface TimetableConflictsProps {
  timetable: Timetable;
  onClose: () => void;
  onResolve: (conflictId: string) => void;
}

export const TimetableConflicts: React.FC<TimetableConflictsProps> = ({
  timetable,
  onClose,
  onResolve
}) => {
  const [selectedConflict, setSelectedConflict] = useState<string | null>(null);
  const [resolving, setResolving] = useState<string | null>(null);

  const handleResolve = async (conflictId: string) => {
    setResolving(conflictId);
    try {
      await onResolve(conflictId);
    } catch (error) {
      console.error('Error resolving conflict:', error);
    } finally {
      setResolving(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'TeacherDoubleBooked':
      case 'TeacherOverload':
        return <UserIcon className="h-5 w-5" />;
      case 'ClassDoubleBooked':
        return <UsersIcon className="h-5 w-5" />;
      case 'RoomDoubleBooked':
        return <ClockIcon className="h-5 w-5" />;
      case 'SubjectOverload':
        return <ShieldAlertIcon className="h-5 w-5" />;
      default:
        return <MoreHorizontalIcon className="h-5 w-5" />;
    }
  };

  const getConflictTitle = (type: string) => {
    switch (type) {
      case 'TeacherDoubleBooked':
        return 'Teacher Double Booking';
      case 'ClassDoubleBooked':
        return 'Class Double Booking';
      case 'RoomDoubleBooked':
        return 'Room Double Booking';
      case 'SubjectOverload':
        return 'Subject Overload';
      case 'TeacherOverload':
        return 'Teacher Overload';
      default:
        return 'Unknown Conflict';
    }
  };

  const getResolutionSuggestion = (conflict: any) => {
    switch (conflict.type) {
      case 'TeacherDoubleBooked':
        return 'Consider moving one of the conflicting classes to a different time slot or assigning a different teacher.';
      case 'ClassDoubleBooked':
        return 'One class cannot attend multiple subjects simultaneously. Reschedule one of the subjects.';
      case 'RoomDoubleBooked':
        return 'Two classes cannot use the same room at the same time. Assign a different room or reschedule.';
      case 'SubjectOverload':
        return 'This subject has more periods scheduled than recommended. Consider reducing the frequency.';
      case 'TeacherOverload':
        return 'This teacher has too many periods in a day. Redistribute some classes to other qualified teachers.';
      default:
        return 'Review the conflicting time slots and make necessary adjustments.';
    }
  };

  const unresolvedConflicts = timetable.conflicts.filter(c => !c.resolved);
  const resolvedConflicts = timetable.conflicts.filter(c => c.resolved);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <ShieldAlertIcon className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Timetable Conflicts</h2>
              <p className="text-gray-600 mt-1">
                {unresolvedConflicts.length} unresolved conflicts in {timetable.name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <XIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {unresolvedConflicts.length === 0 ? (
            <div className="text-center py-12">
              <ShieldAlertIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Conflicts Found!</h3>
              <p className="text-gray-500">
                Your timetable is conflict-free and ready to use.
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Summary */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ShieldAlertIcon className="h-5 w-5 text-red-600" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-900">Conflicts Summary</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <span className="font-medium">Critical:</span>{' '}
                          {unresolvedConflicts.filter(c => c.severity === 'Critical').length}
                        </div>
                        <div>
                          <span className="font-medium">Warning:</span>{' '}
                          {unresolvedConflicts.filter(c => c.severity === 'Warning').length}
                        </div>
                        <div>
                          <span className="font-medium">Info:</span>{' '}
                          {unresolvedConflicts.filter(c => c.severity === 'Info').length}
                        </div>
                        <div>
                          <span className="font-medium">Total:</span>{' '}
                          {unresolvedConflicts.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unresolved Conflicts */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Unresolved Conflicts</h3>
                <div className="space-y-4">
                  {unresolvedConflicts.map((conflict, index) => (
                    <div
                      key={index}
                      className={`border-2 rounded-lg p-4 transition-all duration-200 ${getSeverityColor(conflict.severity)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="mr-3 mt-1">
                            {getConflictIcon(conflict.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">
                              {getConflictTitle(conflict.type)}
                            </h4>
                            <p className="text-sm mb-2">
                              {conflict.description}
                            </p>
                            
                            {/* Affected Slots */}
                            <div className="mb-3">
                              <span className="text-xs font-medium">Affected Time Slots:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {conflict.slotIds.map((slotId, slotIndex) => {
                                  const slot = timetable.slots.find(s => s.id === slotId);
                                  return slot ? (
                                    <span
                                      key={slotIndex}
                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white bg-opacity-50"
                                    >
                                      {slot.day} {slot.startTime}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            </div>

                            {/* Resolution Suggestion */}
                            <div className="bg-white bg-opacity-50 rounded-md p-3 mb-3">
                              <p className="text-xs font-medium mb-1">Suggested Resolution:</p>
                              <p className="text-xs">
                                {getResolutionSuggestion(conflict)}
                              </p>
                            </div>

                            {/* Severity Badge */}
                            <div className="flex items-center">
                              <span className={`
                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${conflict.severity === 'Critical' ? 'bg-red-200 text-red-800' :
                                  conflict.severity === 'Warning' ? 'bg-yellow-200 text-yellow-800' :
                                  'bg-blue-200 text-blue-800'}
                              `}>
                                {conflict.severity}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => setSelectedConflict(
                              selectedConflict === `unresolved-${index}` ? null : `unresolved-${index}`
                            )}
                            className="px-3 py-1 bg-white bg-opacity-75 text-xs font-medium rounded-md hover:bg-opacity-100 transition"
                          >
                            {selectedConflict === `unresolved-${index}` ? 'Hide' : 'Details'}
                          </button>
                          
                          <button
                            onClick={() => handleResolve(`unresolved-${index}`)}
                            disabled={resolving === `unresolved-${index}`}
                            className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition disabled:opacity-50"
                          >
                            {resolving === `unresolved-${index}` ? 'Resolving...' : 'Mark Resolved'}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {selectedConflict === `unresolved-${index}` && (
                        <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                          <h5 className="text-sm font-medium mb-2">Detailed Information</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="font-medium">Conflict Type:</span> {conflict.type}
                            </div>
                            <div>
                              <span className="font-medium">Severity Level:</span> {conflict.severity}
                            </div>
                            <div>
                              <span className="font-medium">Affected Slots:</span> {conflict.slotIds.length}
                            </div>
                            <div>
                              <span className="font-medium">Status:</span> {conflict.resolved ? 'Resolved' : 'Unresolved'}
                            </div>
                          </div>
                          
                          {/* Detailed slot information */}
                          <div className="mt-3">
                            <span className="font-medium text-xs">Slot Details:</span>
                            <div className="mt-1 space-y-1">
                              {conflict.slotIds.map((slotId, slotIndex) => {
                                const slot = timetable.slots.find(s => s.id === slotId);
                                return slot ? (
                                  <div key={slotIndex} className="bg-white bg-opacity-30 rounded p-2 text-xs">
                                    <div><span className="font-medium">Time:</span> {slot.day} {slot.startTime} - {slot.endTime}</div>
                                    <div><span className="font-medium">Class:</span> {slot.classId}</div>
                                    <div><span className="font-medium">Subject:</span> {slot.subjectId}</div>
                                    <div><span className="font-medium">Teacher:</span> {slot.teacherId}</div>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolved Conflicts */}
              {resolvedConflicts.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Resolved Conflicts</h3>
                  <div className="space-y-3">
                    {resolvedConflicts.map((conflict, index) => (
                      <div
                        key={index}
                        className="border border-green-200 bg-green-50 rounded-lg p-4 opacity-75"
                      >
                        <div className="flex items-center">
                          <div className="mr-3">
                            {getConflictIcon(conflict.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-green-900">
                              {getConflictTitle(conflict.type)} (Resolved)
                            </h4>
                            <p className="text-sm text-green-700">
                              {conflict.description}
                            </p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-800">
                            Resolved
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {unresolvedConflicts.length > 0 ? (
                <>
                  <strong>{unresolvedConflicts.length}</strong> conflicts need attention before the timetable can be activated.
                </>
              ) : (
                'All conflicts have been resolved. Your timetable is ready to use!'
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-100 transition"
              >
                Close
              </button>
              
              {unresolvedConflicts.length === 0 && (
                <button
                  onClick={() => {/* Activate timetable */}}
                  className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                >
                  Activate Timetable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



