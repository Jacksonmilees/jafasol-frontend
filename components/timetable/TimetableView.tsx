import React, { useMemo } from 'react';
import { MOCK_TIMETABLES, MOCK_TEACHERS, MOCK_SUBJECTS, MOCK_CLASSES } from '../../constants';
import { TimetableCellData, TimetableEntry } from '../../types';
import { TimetableCell } from './TimetableCell';

interface TimetableViewProps {
    viewMode: 'class' | 'teacher' | 'subject';
    selectedId: string;
}

const DAYS: (keyof Omit<TimetableEntry, 'time'>)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

const TimetableView: React.FC<TimetableViewProps> = ({ viewMode, selectedId }) => {

    const { timeSlots, displayData, title } = useMemo(() => {
        let title = '';
        // Use a representative timetable to get the time slots
        const representativeTimetable = Object.values(MOCK_TIMETABLES)[0] || [];
        const timeSlots = representativeTimetable.map(entry => entry.time);

        let displayData: { [time: string]: { [day: string]: TimetableCellData | null } } = {};
        timeSlots.forEach(time => displayData[time] = {});

        if (viewMode === 'class') {
            const schoolClass = MOCK_CLASSES.find(c => c.id === selectedId);
            title = `Timetable for ${schoolClass?.name || 'Unknown Class'}`;
            const timetable = MOCK_TIMETABLES[selectedId] || [];
            timetable.forEach(entry => {
                DAYS.forEach(day => {
                    const lesson = entry[day];
                    displayData[entry.time][day] = lesson ? { line1: lesson.subject, line2: lesson.teacher } : null;
                });
            });
        } else if (viewMode === 'teacher') {
            const teacher = MOCK_TEACHERS.find(t => t.id === selectedId);
            title = `Timetable for ${teacher?.name || 'Unknown Teacher'}`;
            timeSlots.forEach(time => {
                DAYS.forEach(day => {
                    let foundLesson: TimetableCellData | null = null;
                    for (const classId in MOCK_TIMETABLES) {
                        const schoolClass = MOCK_CLASSES.find(c => c.id === classId);
                        const entry = MOCK_TIMETABLES[classId].find(e => e.time === time);
                        const lesson = entry?.[day];
                        if (lesson?.teacher === teacher?.name) {
                            foundLesson = { line1: lesson.subject, line2: schoolClass?.name || classId };
                            break; 
                        }
                    }
                    displayData[time][day] = foundLesson;
                });
            });
        } else if (viewMode === 'subject') {
            const subject = MOCK_SUBJECTS.find(s => s.id === selectedId);
            title = `Timetable for ${subject?.name || 'Unknown Subject'}`;
            timeSlots.forEach(time => {
                DAYS.forEach(day => {
                    let foundLesson: TimetableCellData | null = null;
                    for (const classId in MOCK_TIMETABLES) {
                        const schoolClass = MOCK_CLASSES.find(c => c.id === classId);
                        const entry = MOCK_TIMETABLES[classId].find(e => e.time === time);
                        const lesson = entry?.[day];
                        if (lesson?.subject === subject?.name) {
                            foundLesson = { line1: schoolClass?.name || classId, line2: lesson.teacher };
                            break;
                        }
                    }
                    displayData[time][day] = foundLesson;
                });
            });
        }

        return { timeSlots, displayData, title };
    }, [viewMode, selectedId]);

    return (
        <div className="p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">{title}</h3>
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                    <tr>
                        <th scope="col" className="py-3 px-6 font-medium border border-gray-200">Time</th>
                        {DAYS.map(day => (
                            <th key={day} scope="col" className="py-3 px-6 font-medium border border-gray-200 text-center capitalize">{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {timeSlots.map(time => (
                    <tr key={time}>
                        <td className="py-3 px-6 font-semibold bg-gray-50 border border-gray-200 text-gray-700">{time}</td>
                        {DAYS.map(day => (
                            <TimetableCell key={day} entry={displayData[time][day]} />
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TimetableView;