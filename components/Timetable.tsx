import React, { useState } from 'react';
import { TimetableIcon, TableIcon } from './icons';
import ClassTimetable from './timetable/ClassTimetable';
import ExamTimetable from './timetable/ExamTimetable';

const Timetable: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'class' | 'exam'>('class');

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Timetables</h2>
                <p className="text-gray-500 mt-1">Manage weekly class schedules and exam timetables.</p>
            </div>
            
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('class')}
                        className={`shrink-0 flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                            activeTab === 'class'
                                ? 'border-teal-500 text-teal-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                    >
                        <TimetableIcon className="h-5 w-5" />
                        Class Timetable
                    </button>
                    <button
                        onClick={() => setActiveTab('exam')}
                        className={`shrink-0 flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                            activeTab === 'exam'
                                ? 'border-teal-500 text-teal-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                    >
                        <TableIcon className="h-5 w-5" />
                        Exam Timetable
                    </button>
                </nav>
            </div>
            
            <div>
                {activeTab === 'class' ? <ClassTimetable /> : <ExamTimetable />}
            </div>
        </div>
    );
};

export default Timetable;