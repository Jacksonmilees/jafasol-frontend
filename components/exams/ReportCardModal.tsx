

import React, { useMemo, useState } from 'react';
import { Exam, Student, ExamResult, Grade, PerformanceData, Subject } from '../../types';
import { MOCK_SUBJECTS, MOCK_GRADING_SYSTEM, MOCK_ACADEMIC_YEAR, MOCK_STUDENTS, MOCK_EXAMS } from '../../constants';
import { XIcon, LogoIcon, PrinterIcon } from '../icons';
import { StudentPerformanceChart } from '../reports/StudentPerformanceChart';

const getGrade = (score: number | null): Grade | null => {
    if (score === null || score === undefined) return null;
    return MOCK_GRADING_SYSTEM.find(g => score >= g.minScore && score <= g.maxScore) || null;
};


interface ReportCardModalProps {
    exam: Exam;
    student: Student;
    results: ExamResult;
    onClose: () => void;
    rank?: number | 'N/A';
    comment?: string;
    totalStudents?: number;
}


export const ReportCardModal: React.FC<ReportCardModalProps> = ({ exam, student, results, onClose, rank, comment, totalStudents }) => {
    
    const handlePrint = () => {
        window.print();
    };

    const examSubjects = MOCK_SUBJECTS.filter(s => exam.subjects.includes(s.id));
    
    const { classRankings, totalMarks, averageScore, overallGrade, scores } = useMemo(() => {
        const studentsInClass = MOCK_STUDENTS.filter(s => s.formClass === student.formClass && s.stream === student.stream);
        const examResultsForClass = studentsInClass.map(s => {
            const studentExamRecord = s.examResults?.[exam.id];
            if (!studentExamRecord) return { studentId: s.id, average: 0 };
            
            const scores = Object.values(studentExamRecord.results).filter(val => typeof val === 'number') as number[];
            const average = scores.length > 0 ? scores.reduce((a,b) => a+b, 0) / scores.length : 0;
            return { studentId: s.id, average };
        });
        
        examResultsForClass.sort((a,b) => b.average - a.average);
        const classRank = examResultsForClass.findIndex(r => r.studentId === student.id) + 1;

        const scores = examSubjects.map(s => results[s.id]).filter(s => s !== null && s !== undefined) as number[];
        const totalMarks = scores.reduce((acc, score) => acc + (score || 0), 0);
        const averageScore = scores.length > 0 ? totalMarks / scores.length : 0;
        const overallGrade = getGrade(averageScore);

        return { classRankings: { classRank, totalInClass: studentsInClass.length }, totalMarks, averageScore, overallGrade, scores };
    }, [student, exam, results, examSubjects]);


    const subjectRankings = useMemo(() => {
        const studentsInClass = MOCK_STUDENTS.filter(s => s.formClass === student.formClass && s.stream === student.stream);
        const rankings: {[subjectId: string]: { rank: number, outOf: number }} = {};

        examSubjects.forEach(subject => {
            const subjectScores = studentsInClass.map(s => ({
                studentId: s.id,
                score: s.id === student.id ? (results[subject.id] ?? -1) : (s.examResults?.[exam.id]?.results[subject.id] ?? -1)
            })).sort((a, b) => b.score - a.score);
            
            const studentRank = subjectScores.findIndex(s => s.studentId === student.id) + 1;
            rankings[subject.id] = { rank: studentRank, outOf: studentsInClass.length };
        });
        return rankings;
    }, [student, exam, results, examSubjects]);


    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 non-printable">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-800">Student Report Card</h2>
                    <div className="flex items-center space-x-2">
                        <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
                          <PrinterIcon className="h-5 w-5 mr-2" />
                          Print
                        </button>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                            <XIcon className="h-6 w-6 text-slate-500" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    <div className="p-6 bg-white printable-area" id="report-card">
                        {/* Header */}
                        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
                            <div className="flex items-center">
                                <LogoIcon className="h-16 w-16 text-indigo-600" />
                                <div className="ml-4">
                                    <h1 className="text-3xl font-bold text-slate-800">GREEN VALLEY HIGH SCHOOL</h1>
                                    <p className="text-slate-500">Excellence and Integrity</p>
                                </div>
                            </div>
                             <img className="h-20 w-20 rounded-md object-cover border-2 border-slate-200" src={student.avatarUrl} alt={`${student.firstName} ${student.lastName}`} />
                        </div>

                        {/* Student Details */}
                         <div className="text-center bg-slate-50 py-2 my-4 rounded-md">
                            <h2 className="text-xl font-bold text-slate-800">{exam.name} - {exam.term}</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-4 my-6 text-sm">
                            <div><span className="font-semibold">Student Name:</span> {student.firstName} {student.lastName}</div>
                            <div><span className="font-semibold">Admission No:</span> {student.admissionNumber}</div>
                            <div><span className="font-semibold">Class:</span> {student.formClass} {student.stream}</div>
                        </div>

                        {/* Results Table */}
                        <table className="w-full text-sm text-left border-collapse border border-slate-300">
                            <thead className="bg-slate-100 text-slate-600 uppercase">
                                <tr>
                                    <th className="p-2 border border-slate-300">Subject</th>
                                    <th className="p-2 border border-slate-300 text-center">Score</th>
                                    <th className="p-2 border border-slate-300 text-center">Grade</th>
                                    <th className="p-2 border border-slate-300 text-center">Rank</th>
                                    <th className="p-2 border border-slate-300">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {examSubjects.map(subject => {
                                    const score = results[subject.id];
                                    const grade = getGrade(score ?? null);
                                    const subjectRank = subjectRankings[subject.id];
                                    return (
                                        <tr key={subject.id} className="border-b border-slate-300">
                                            <td className="p-2 border-r border-slate-300 font-medium text-slate-800">{subject.name}</td>
                                            <td className="p-2 border-r border-slate-300 text-center font-semibold">{score ?? '—'}</td>
                                            <td className="p-2 border-r border-slate-300 text-center font-bold text-indigo-700">{grade?.name ?? '—'}</td>
                                            <td className="p-2 border-r border-slate-300 text-center">{subjectRank.rank > 0 ? `${subjectRank.rank}/${subjectRank.outOf}` : 'N/A'}</td>
                                            <td className="p-2">{grade?.comment ?? '—'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        
                        {/* Summary */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                            <div className="lg:col-span-2 bg-slate-50 p-4 rounded-lg">
                               <StudentPerformanceChart student={student} />
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg flex flex-col justify-between">
                                 <div>
                                    <h4 className="font-semibold text-slate-800 mb-2">Performance Summary</h4>
                                    <div className="text-sm space-y-1">
                                        <p>Total Marks: <span className="font-bold">{totalMarks} / {scores.length * 100}</span></p>
                                        <p>Average Score: <span className="font-bold">{averageScore.toFixed(2)}%</span></p>
                                        <p>Overall Grade: <span className="font-bold text-xl text-indigo-600">{overallGrade?.name ?? 'N/A'}</span></p>
                                        {classRankings.classRank > 0 && <p>Position in Class: <span className="font-bold">{classRankings.classRank} / {classRankings.totalInClass}</span></p>}
                                        {rank && totalStudents && <p>Overall Rank: <span className="font-bold">{rank} / {totalStudents}</span></p>}
                                    </div>
                                </div>
                                <div className="mt-4">
                                     <h4 className="font-semibold text-slate-800 mb-2">Class Teacher's Comment</h4>
                                     <p className="text-sm italic text-slate-600 h-16 overflow-y-auto">
                                        {comment || (overallGrade?.comment ? `${overallGrade.comment}.` : 'No specific comment provided.')}
                                     </p>
                                 </div>
                            </div>
                        </div>

                         {/* Grading Key */}
                        <div className="mt-6">
                             <h4 className="font-semibold text-slate-800 mb-2 text-sm">Grading System</h4>
                             <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                 {MOCK_GRADING_SYSTEM.map(g => (
                                     <span key={g.name}>{g.name}: {g.minScore}-{g.maxScore}%</span>
                                 ))}
                             </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-8 pt-4 border-t border-slate-200 text-xs text-slate-400">
                           <p>Report generated on {new Date().toLocaleDateString()} for the {MOCK_ACADEMIC_YEAR.year} academic year.</p>
                           <p className="mt-1">For any queries, please log in to the parent portal or contact the school office.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};