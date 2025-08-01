
import React from 'react';
import { AcademicYear, Grade } from '../../types';
import { SaveIcon } from '../icons';

interface AcademicSettingsProps {
    academicYear: AcademicYear;
    setAcademicYear: React.Dispatch<React.SetStateAction<AcademicYear>>;
    gradingSystem: Grade[];
    setGradingSystem: React.Dispatch<React.SetStateAction<Grade[]>>;
}

export const AcademicSettings: React.FC<AcademicSettingsProps> = ({ 
    academicYear, setAcademicYear,
    gradingSystem, setGradingSystem
}) => {

    const handleGradeChange = (index: number, field: keyof Grade, value: string | number) => {
        const newGradingSystem = [...gradingSystem];
        (newGradingSystem[index] as any)[field] = value;
        setGradingSystem(newGradingSystem);
    };

    const handleSaveChanges = () => {
        alert('Academic settings saved!');
    };

    return (
        <div className="space-y-8">
            {/* Academic Year Card */}
            <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm">
                <div className="p-4 md:p-6 border-b border-slate-200">
                    <h3 className="text-lg font-medium leading-6 text-slate-900">Academic Calendar</h3>
                    <p className="mt-1 text-sm text-slate-500">Set the current year, term, and dates for the entire system.</p>
                </div>
                <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="academicYear" className="block text-sm font-medium text-slate-700">Academic Year</label>
                        <input type="text" id="academicYear" value={academicYear.year} onChange={(e) => setAcademicYear({...academicYear, year: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="currentTerm" className="block text-sm font-medium text-slate-700">Current Term</label>
                        <select id="currentTerm" value={academicYear.currentTerm} onChange={(e) => setAcademicYear({...academicYear, currentTerm: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            <option>Term 1</option>
                            <option>Term 2</option>
                            <option>Term 3</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="termStartDate" className="block text-sm font-medium text-slate-700">Term Start Date</label>
                        <input type="date" id="termStartDate" value={academicYear.termStartDate} onChange={(e) => setAcademicYear({...academicYear, termStartDate: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="termEndDate" className="block text-sm font-medium text-slate-700">Term End Date</label>
                        <input type="date" id="termEndDate" value={academicYear.termEndDate} onChange={(e) => setAcademicYear({...academicYear, termEndDate: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                </div>
            </div>

            {/* Grading System Card */}
            <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm">
                <div className="p-4 md:p-6 border-b border-slate-200">
                    <h3 className="text-lg font-medium leading-6 text-slate-900">Grading System</h3>
                    <p className="mt-1 text-sm text-slate-500">Define the score ranges and comments for each grade.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                         <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                            <tr>
                                <th className="px-4 py-2 text-left font-medium">Grade</th>
                                <th className="px-4 py-2 text-left font-medium">Min Score (%)</th>
                                <th className="px-4 py-2 text-left font-medium">Max Score (%)</th>
                                <th className="px-4 py-2 text-left font-medium">Comment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {gradingSystem.map((grade, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 font-semibold text-slate-700">{grade.name}</td>
                                    <td className="px-4 py-2">
                                        <input type="number" value={grade.minScore} onChange={(e) => handleGradeChange(index, 'minScore', parseInt(e.target.value))} className="w-24 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input type="number" value={grade.maxScore} onChange={(e) => handleGradeChange(index, 'maxScore', parseInt(e.target.value))} className="w-24 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input type="text" value={grade.comment} onChange={(e) => handleGradeChange(index, 'comment', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-slate-200 mt-8">
                 <button 
                    onClick={handleSaveChanges}
                    className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                    <SaveIcon className="h-5 w-5 mr-2" />
                    Save Academic Settings
                </button>
            </div>
        </div>
    );
};
