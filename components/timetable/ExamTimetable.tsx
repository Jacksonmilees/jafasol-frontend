import React from 'react';
import { TableIcon } from '../icons';

const ExamTimetable: React.FC = () => {
    return (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-8 text-center">
            <div className="mx-auto w-fit bg-slate-100 p-4 rounded-full">
                <TableIcon className="h-10 w-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mt-4">Exam Timetable Generator</h3>
            <p className="text-slate-500 mt-1">This feature is under construction.</p>
            <p className="text-sm text-slate-500 mt-2">Soon, you'll be able to automatically generate and view exam schedules here.</p>
        </div>
    );
};

export default ExamTimetable;
