import React, { useState, useMemo } from 'react';
import { MOCK_EXAMS, MOCK_STUDENTS, MOCK_CLASSES } from '../../constants';
import { ChevronDownIcon } from '../icons';

export const ClassPerformance: React.FC = () => {
    const completedExams = MOCK_EXAMS.filter(e => e.status === 'Completed');
    const [selectedExamId, setSelectedExamId] = useState<string>(completedExams[0]?.id || '');

    const rankedClasses = useMemo(() => {
        if (!selectedExamId) return [];

        return MOCK_CLASSES.map(schoolClass => {
            const classStudents = MOCK_STUDENTS.filter(s => s.formClass === schoolClass.name.split(' ')[0] && s.stream === schoolClass.stream);
            
            if (classStudents.length === 0) {
                return { ...schoolClass, averageScore: 0, studentCount: 0 };
            }

            const scores = classStudents.map(s => {
                const results = s.examResults?.[selectedExamId]?.results;
                if (!results) return 0;
                const studentScores = Object.values(results).filter(v => v !== null) as number[];
                if(studentScores.length === 0) return 0;
                return studentScores.reduce((a, b) => a + b, 0) / studentScores.length;
            });

            const totalAverage = scores.reduce((a, b) => a + b, 0) / scores.length;
            return { ...schoolClass, averageScore: totalAverage, studentCount: classStudents.length };
        }).sort((a, b) => b.averageScore - a.averageScore);
    }, [selectedExamId]);

    

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                 <div>
                    <h3 className="text-lg font-semibold text-gray-800">Class Performance Rankings</h3>
                    <p className="text-sm text-gray-500 mt-1">Compare overall class performance for a selected exam.</p>
                </div>
                <div className="relative mt-4 md:mt-0">
                    <select 
                        value={selectedExamId}
                        onChange={(e) => setSelectedExamId(e.target.value)}
                        className="pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition appearance-none">
                       {completedExams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th scope="col" className="py-3 px-6 font-medium">Rank</th>
                            <th scope="col" className="py-3 px-6 font-medium">Class Name</th>
                            <th scope="col" className="py-3 px-6 font-medium">Class Teacher</th>
                            <th scope="col" className="py-3 px-6 font-medium">Students</th>
                            <th scope="col" className="py-3 px-6 font-medium">Average Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {rankedClasses.map((c, index) => (
                             <tr key={c.id} className="hover:bg-gray-50">
                                <td className="py-3 px-6">
                                    <span className="font-bold text-lg text-gray-700">{index + 1}</span>
                                </td>
                                <td className="py-3 px-6">
                                    <p className="font-semibold text-gray-800">{c.name}</p>
                                </td>
                                <td className="py-3 px-6 text-gray-600">{c.teacher}</td>
                                <td className="py-3 px-6 text-gray-600">{c.studentCount}</td>
                                <td className="py-3 px-6">
                                    <span className="font-semibold text-teal-600 text-base">{c.averageScore.toFixed(2)}%</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};