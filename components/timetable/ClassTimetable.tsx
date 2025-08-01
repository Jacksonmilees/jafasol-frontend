import React, { useState, useMemo } from 'react';
import { MOCK_CLASSES, MOCK_TEACHERS, MOCK_SUBJECTS } from '../../constants';
import { ChevronDownIcon, Wand2Icon, PrinterIcon } from '../icons';
import { TimetableGeneratorModal } from './TimetableGeneratorModal';
import TimetableView from './TimetableView';

const ClassTimetable: React.FC = () => {
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'subject'>('class');
    const [selectedId, setSelectedId] = useState<string>(MOCK_CLASSES[0].id);

    const dropdownOptions = useMemo(() => {
        switch (viewMode) {
            case 'teacher':
                return MOCK_TEACHERS;
            case 'subject':
                return MOCK_SUBJECTS;
            case 'class':
            default:
                return MOCK_CLASSES;
        }
    }, [viewMode]);
    
    const handleViewModeChange = (mode: 'class' | 'teacher' | 'subject') => {
        setViewMode(mode);
        // Reset selection when mode changes
        if (mode === 'class') setSelectedId(MOCK_CLASSES[0].id);
        if (mode === 'teacher') setSelectedId(MOCK_TEACHERS[0].id);
        if (mode === 'subject') setSelectedId(MOCK_SUBJECTS[0].id);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-1 border border-gray-200 p-1 rounded-lg">
                       {(['class', 'teacher', 'subject'] as const).map(mode => (
                           <button 
                                key={mode}
                                onClick={() => handleViewModeChange(mode)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === mode ? 'bg-teal-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                           >
                               View by {mode.charAt(0).toUpperCase() + mode.slice(1)}
                           </button>
                       ))}
                    </div>
                    <div className="flex items-center space-x-2 w-full md:w-auto">
                        <div className="relative flex-grow">
                            <select 
                                value={selectedId}
                                onChange={(e) => setSelectedId(e.target.value)}
                                className="w-full pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition appearance-none">
                            {dropdownOptions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                         <button
                            onClick={handlePrint}
                            className="flex items-center justify-center p-2 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition" title="Print Timetable">
                            <PrinterIcon className="h-5 w-5" />
                        </button>
                         <button
                            onClick={() => setIsGeneratorOpen(true)}
                            className="flex items-center justify-center px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition whitespace-nowrap">
                            <Wand2Icon className="h-5 w-5 mr-2" />
                            Generate with AI
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-x-auto" id="timetable-printable-area">
                   <TimetableView viewMode={viewMode} selectedId={selectedId} />
                </div>
            </div>
            
            {isGeneratorOpen && <TimetableGeneratorModal onClose={() => setIsGeneratorOpen(false)} />}
        </>
    );
};

export default ClassTimetable;