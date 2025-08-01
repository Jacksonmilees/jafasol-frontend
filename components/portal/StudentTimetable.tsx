import React, { useMemo } from 'react';
import { MOCK_TIMETABLES, MOCK_CLASSES } from '../../constants';
import { Student } from '../../types';
import { TimetableIcon } from '../icons';
import { TimetableCell } from '../timetable/TimetableCell';


export const StudentTimetable: React.FC<{ student: Student }> = ({ student }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const timetableData = useMemo(() => {
        // Find the class ID for the current student
        const studentClass = MOCK_CLASSES.find(c => {
            const formLevel = parseInt(student.formClass.replace('Form ', ''), 10);
            return c.formLevel === formLevel && c.stream === student.stream;
        });
        
        if (studentClass && MOCK_TIMETABLES[studentClass.id]) {
            return MOCK_TIMETABLES[studentClass.id];
        }

        return [];
    }, [student]);

    return (
         <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
             <div className="p-4 md:p-6 border-b border-gray-200">
                <div className="flex items-center">
                    <TimetableIcon className="h-6 w-6 text-teal-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-800">Weekly Timetable</h3>
                </div>
            </div>
            <div className="p-2 sm:p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="py-2 px-2 font-medium text-gray-500 text-xs border-b border-gray-200">Time</th>
                                {days.map(day => (
                                    <th key={day} className="py-2 px-2 font-medium text-gray-500 text-xs border-b border-gray-200 text-center">{day.substring(0,3)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                        {timetableData.length > 0 ? (
                            timetableData.map(row => (
                                <tr key={row.time}>
                                    <td className="py-2 px-2 font-semibold text-gray-600 text-xs border-b border-gray-100">{row.time}</td>
                                    <TimetableCell entry={row.monday ? { line1: row.monday.subject, line2: row.monday.teacher } : null} isPortal={true} />
                                    <TimetableCell entry={row.tuesday ? { line1: row.tuesday.subject, line2: row.tuesday.teacher } : null} isPortal={true} />
                                    <TimetableCell entry={row.wednesday ? { line1: row.wednesday.subject, line2: row.wednesday.teacher } : null} isPortal={true} />
                                    <TimetableCell entry={row.thursday ? { line1: row.thursday.subject, line2: row.thursday.teacher } : null} isPortal={true} />
                                    <TimetableCell entry={row.friday ? { line1: row.friday.subject, line2: row.friday.teacher } : null} isPortal={true} />
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500 italic">Timetable not available for this class.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};