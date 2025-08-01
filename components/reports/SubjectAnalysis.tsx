import React, { useState, useMemo } from 'react';
import { MOCK_EXAMS, MOCK_SUBJECTS, MOCK_STUDENTS } from '../../constants';
import { ChevronDownIcon } from '../icons';

interface SubjectStat {
    subjectId: string;
    subjectName: string;
    averageScore: number;
    studentCount: number;
}

const colors = ["bg-teal-500", "bg-green-500", "bg-amber-500", "bg-sky-500", "bg-rose-500", "bg-cyan-500", "bg-fuchsia-500", "bg-lime-500"];

export const SubjectAnalysis: React.FC = () => {
    const completedExams = MOCK_EXAMS.filter(e => e.status === 'Completed');
    const [selectedExamId, setSelectedExamId] = useState<string>(completedExams[0]?.id || '');

    const subjectStats = useMemo((): SubjectStat[] => {
        if (!selectedExamId) return [];

        const exam = MOCK_EXAMS.find(e => e.id === selectedExamId);
        if (!exam) return [];

        const examSubjects = MOCK_SUBJECTS.filter(s => exam.subjects.includes(s.id));

        return examSubjects.map(subject => {
            const scores: number[] = [];
            MOCK_STUDENTS.forEach(student => {
                const score = student.examResults?.[selectedExamId]?.results[subject.id];
                if (typeof score === 'number') {
                    scores.push(score);
                }
            });

            const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
            return {
                subjectId: subject.id,
                subjectName: subject.name,
                averageScore,
                studentCount: scores.length
            };
        }).sort((a, b) => b.averageScore - a.averageScore);
    }, [selectedExamId]);
    
    const maxScore = 100;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                 <div>
                    <h3 className="text-lg font-semibold text-gray-800">Subject Performance Analysis</h3>
                    <p className="text-sm text-gray-500 mt-1">View the average score per subject for a selected exam.</p>
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

            <div className="space-y-4">
                {subjectStats.map((stat, index) => (
                    <div key={stat.subjectId} className="flex items-center group">
                        <div className="w-32 text-sm font-medium text-gray-600 text-right pr-4">{stat.subjectName}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-6">
                            <div 
                                className={`h-6 rounded-full ${colors[index % colors.length]} transition-all duration-500 flex items-center justify-end pr-2`}
                                style={{ width: `${(stat.averageScore / maxScore) * 100}%` }}
                            >
                               <span className="text-white text-xs font-bold">{stat.averageScore.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                ))}
                 {subjectStats.length === 0 && (
                    <div className="p-8 text-center border-2 border-dashed rounded-lg text-gray-500">
                        <p>No subject data available for the selected exam.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};