

import React, { useState } from 'react';
import { Student, Exam, ExamResult, Grade } from '../../types';
import { MOCK_EXAMS, MOCK_GRADING_SYSTEM, MOCK_SUBJECTS } from '../../constants';
import { BookOpenIcon } from '../icons';
import { ReportCardModal } from '../exams/ReportCardModal';

interface AcademicResultsCardProps {
    student: Student;
}

const getGrade = (score: number | null): Grade | null => {
    if (score === null || score === undefined) return null;
    return MOCK_GRADING_SYSTEM.find(g => score >= g.minScore && score <= g.maxScore) || null;
};

export const AcademicResultsCard: React.FC<AcademicResultsCardProps> = ({ student }) => {
    const [reportToShow, setReportToShow] = useState<Exam | null>(null);

    const completedExams = MOCK_EXAMS
        .filter(exam => exam.status === 'Completed' && student.examResults?.[exam.id])
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    return (
        <>
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm">
                <div className="p-4 md:p-6 border-b border-slate-200">
                    <div className="flex items-center">
                        <BookOpenIcon className="h-6 w-6 text-indigo-500 mr-3" />
                        <h3 className="text-lg font-semibold text-slate-800">Academic Results</h3>
                    </div>
                </div>
                <div className="p-4 md:p-6 space-y-4">
                    {completedExams.length > 0 ? (
                        completedExams.map(exam => {
                            const results = student.examResults![exam.id].results;
                            const scores = Object.values(results).filter(s => s !== null) as number[];
                            const total = scores.reduce((acc, score) => acc + score, 0);
                            const average = scores.length > 0 ? total / scores.length : 0;
                            const grade = getGrade(average);

                            return (
                                <div key={exam.id} className="bg-slate-50 p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-slate-700">{exam.name}</p>
                                        <p className="text-sm text-slate-500">{exam.term} &middot; Average: <span className="font-bold">{average.toFixed(1)}%</span> &middot; Grade: <span className="font-bold">{grade?.name || 'N/A'}</span></p>
                                    </div>
                                    <button 
                                        onClick={() => setReportToShow(exam)}
                                        className="px-3 py-1.5 bg-white text-slate-700 text-sm font-medium rounded-md border border-slate-300 hover:bg-slate-100 transition">
                                        View Report
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-sm text-slate-500 italic text-center py-4">No completed exam results are available at this time.</p>
                    )}
                </div>
            </div>
            {reportToShow && (
                <ReportCardModal
                    exam={reportToShow}
                    student={student}
                    results={student.examResults?.[reportToShow.id]?.results || {}}
                    comment={student.examResults?.[reportToShow.id]?.comment}
                    onClose={() => setReportToShow(null)}
                />
            )}
        </>
    );
};