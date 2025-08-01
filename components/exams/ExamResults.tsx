

import React, { useState, useMemo, useEffect } from 'react';
import { Exam, Student, Subject, ExamResult, User } from '../../types';
import { MOCK_STUDENTS, MOCK_SUBJECTS, MOCK_TEACHERS } from '../../constants';
import { ArrowLeftIcon, FileTextIcon, SaveIcon, Wand2Icon, LockIcon, UploadCloudIcon } from '../icons';
import { ReportCardModal } from './ReportCardModal';
import { GoogleGenAI } from '@google/genai';
import { BulkUploadMarksModal } from './BulkUploadMarksModal';

interface ExamResultsProps {
    exam: Exam;
    onBack: () => void;
    currentUser: User;
}

export const ExamResults: React.FC<ExamResultsProps> = ({ exam, onBack, currentUser }) => {
    const [results, setResults] = useState<{ [studentId: string]: ExamResult }>({});
    const [comments, setComments] = useState<{ [studentId: string]: string }>({});
    const [studentForReport, setStudentForReport] = useState<{ student: Student; rank: number | 'N/A' } | null>(null);
    const [generatingCommentFor, setGeneratingCommentFor] = useState<string | null>(null);
    const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);

    useEffect(() => {
        const initialResults: { [studentId: string]: ExamResult } = {};
        const initialComments: { [studentId: string]: string } = {};
        MOCK_STUDENTS.forEach(student => {
            initialResults[student.id] = student.examResults?.[exam.id]?.results || {};
            initialComments[student.id] = student.examResults?.[exam.id]?.comment || '';
        });
        setResults(initialResults);
        setComments(initialComments);
    }, [exam.id]);
    
    const examSubjects = useMemo(() => {
        return MOCK_SUBJECTS.filter(s => exam.subjects.includes(s.id));
    }, [exam.subjects]);

    const studentStats = useMemo(() => MOCK_STUDENTS.map(student => {
        const studentResults = results[student.id] || {};
        const scores = examSubjects
            .map(s => studentResults[s.id])
            .filter(s => typeof s === 'number') as number[];
        
        const total = scores.reduce((sum, score) => sum + score, 0);
        const average = scores.length > 0 ? (total / scores.length) : 0;
        return { studentId: student.id, total, average };
    }), [results, examSubjects]);

    const rankMap = useMemo(() => {
        const sorted = [...studentStats].sort((a, b) => b.average - a.average);
        const ranks: { [studentId: string]: number } = {};
        let rank = 1;
        sorted.forEach((stat, index) => {
            if (index > 0 && stat.average < sorted[index - 1].average) {
                rank = index + 1;
            }
            ranks[stat.studentId] = rank;
        });
        return ranks;
    }, [studentStats]);


    const handleMarkChange = (studentId: string, subjectId: string, value: string) => {
        const score = value === '' ? null : parseInt(value, 10);
        if (score !== null && (isNaN(score) || score < 0 || score > 100)) return;

        setResults(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [subjectId]: score,
            }
        }));
    };

    const handleCommentChange = (studentId: string, value: string) => {
        setComments(prev => ({ ...prev, [studentId]: value }));
    };
    
    const handleSaveResults = (studentId: string) => {
        // In a real app, this would be an API call to save results and comments
        console.log(`Saving results for student ${studentId}:`, results[studentId]);
        console.log(`Saving comment for student ${studentId}:`, comments[studentId]);
        alert(`Results for student ${MOCK_STUDENTS.find(s=>s.id === studentId)?.firstName} saved! (Check console)`);
    };

    const handleBulkUpdateResults = (data: { studentId: string; results: ExamResult; comment: string }[]) => {
        let newResults = { ...results };
        let newComments = { ...comments };
    
        data.forEach(item => {
            newResults[item.studentId] = { ...newResults[item.studentId], ...item.results };
            if (item.comment) {
                newComments[item.studentId] = item.comment;
            }
        });
    
        setResults(newResults);
        setComments(newComments);
        setIsBulkUploadModalOpen(false);
    };

    const handleGenerateComment = async (studentId: string) => {
        setGeneratingCommentFor(studentId);

        const student = MOCK_STUDENTS.find(s => s.id === studentId);
        if (!student) {
            console.error("Student not found");
            setGeneratingCommentFor(null);
            return;
        }

        const studentResults = results[studentId] || {};
        const scoresText = examSubjects
            .map(subject => {
                const score = studentResults[subject.id];
                return score !== null && score !== undefined ? `${subject.name}: ${score}` : null;
            })
            .filter(Boolean)
            .join(', ');

        if (!scoresText) {
            alert("No results to generate a comment from.");
            setGeneratingCommentFor(null);
            return;
        }

        const prompt = `Generate a brief, constructive teacher's comment for a student named ${student.firstName}. The tone should be encouraging. The student scored the following marks (out of 100) in the ${exam.name}: ${scoresText}. Keep the comment to 1-2 sentences. Highlight strengths and suggest areas for improvement if applicable.`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const generatedComment = result.text.trim();
            handleCommentChange(studentId, generatedComment);

        } catch (e) {
            console.error(e);
            alert("Failed to generate AI comment. Please check the console for details.");
        } finally {
            setGeneratingCommentFor(null);
        }
    };

    const canEditMarks = (subjectName: string): boolean => {
        if (currentUser.role.name === 'Admin') {
            return true;
        }
        if (['Class Teacher', 'Subject Teacher'].includes(currentUser.role.name)) {
            const teacherProfile = MOCK_TEACHERS.find(t => t.id === currentUser.id);
            return !!teacherProfile?.subjects.includes(subjectName);
        }
        return false;
    };

    const isLockedForCurrentUser = exam.marksLocked && currentUser.role.name !== 'Admin';

    return (
        <>
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm">
                 <div className="p-4 md:p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                         <div className="flex items-center">
                            <button onClick={onBack} className="p-2 mr-3 rounded-md hover:bg-slate-100 transition-colors">
                                <ArrowLeftIcon className="h-5 w-5 text-slate-600" />
                            </button>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800">Manage Results: {exam.name}</h2>
                                <p className="text-sm text-slate-500 mt-1">{exam.term}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setIsBulkUploadModalOpen(true)}
                                disabled={isLockedForCurrentUser}
                                className="flex items-center justify-center px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
                                <UploadCloudIcon className="h-5 w-5 mr-2" />
                                Bulk Upload Marks
                            </button>
                        </div>
                    </div>
                </div>
                {isLockedForCurrentUser && (
                    <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-center">
                        <LockIcon className="h-5 w-5 text-amber-600 mr-3"/>
                        <p className="text-sm text-amber-800 font-medium">Results for this exam are locked. No further edits can be made.</p>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="py-3 px-6 font-medium sticky left-0 bg-slate-50 z-10 min-w-[200px]">Student Name</th>
                                {examSubjects.map(subject => (
                                    <th key={subject.id} scope="col" className="py-3 px-2 font-medium text-center w-28">{subject.name}</th>
                                ))}
                                <th scope="col" className="py-3 px-3 font-medium text-center">Total</th>
                                <th scope="col" className="py-3 px-3 font-medium text-center">Avg.</th>
                                <th scope="col" className="py-3 px-3 font-medium text-center">Rank</th>
                                <th scope="col" className="py-3 px-6 font-medium min-w-[300px]">Teacher's Comment</th>
                                <th scope="col" className="py-3 px-6 font-medium text-center sticky right-0 bg-slate-50 z-10">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {MOCK_STUDENTS.map(student => {
                                const stat = studentStats.find(s => s.studentId === student.id) || { total: 0, average: 0 };
                                const rank = rankMap[student.id] ?? 'N/A';
                                const studentResults = results[student.id] || {};
                                const comment = comments[student.id] || '';

                                return (
                                    <tr key={student.id} className="hover:bg-slate-50">
                                        <td className="py-2 px-6 sticky left-0 bg-white hover:bg-slate-50 z-10 border-r">
                                            <p className="font-semibold text-slate-800">{student.firstName} {student.lastName}</p>
                                            <p className="text-xs text-slate-500">{student.admissionNumber}</p>
                                        </td>
                                        {examSubjects.map(subject => (
                                            <td key={subject.id} className="py-2 px-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={studentResults[subject.id] ?? ''}
                                                    onChange={e => handleMarkChange(student.id, subject.id, e.target.value)}
                                                    className="w-20 p-2 text-center border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-slate-100 disabled:cursor-not-allowed"
                                                    placeholder="-"
                                                    disabled={isLockedForCurrentUser || !canEditMarks(subject.name)}
                                                    title={isLockedForCurrentUser ? 'Results are locked' : !canEditMarks(subject.name) ? 'Only the assigned subject teacher can edit this mark.' : ''}
                                                />
                                            </td>
                                        ))}
                                        <td className="py-2 px-3 text-center font-semibold text-slate-700">{stat.total > 0 ? stat.total : '—'}</td>
                                        <td className="py-2 px-3 text-center font-semibold text-indigo-600">{stat.average > 0 ? stat.average.toFixed(1) : '—'}</td>
                                        <td className="py-2 px-3 text-center font-bold text-slate-700">{rank}</td>
                                        <td className="py-2 px-6">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={comment}
                                                    onChange={e => handleCommentChange(student.id, e.target.value)}
                                                    className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pr-10 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                                    placeholder="Enter comment or generate..."
                                                    disabled={isLockedForCurrentUser}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleGenerateComment(student.id)}
                                                    disabled={isLockedForCurrentUser || generatingCommentFor === student.id}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 text-indigo-600 disabled:text-slate-400 disabled:cursor-not-allowed"
                                                    title="Generate with AI"
                                                >
                                                    {generatingCommentFor === student.id ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                                                    ) : (
                                                        <Wand2Icon className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-2 px-6 sticky right-0 bg-white hover:bg-slate-50 z-10 border-l">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button 
                                                    onClick={() => handleSaveResults(student.id)}
                                                    disabled={isLockedForCurrentUser}
                                                    className="p-2 rounded-md hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed" title="Save">
                                                    <SaveIcon className="h-5 w-5 text-slate-500"/>
                                                </button>
                                                <button 
                                                    onClick={() => setStudentForReport({student, rank})}
                                                    className="p-2 rounded-md hover:bg-slate-200 transition-colors" title="View Report Card">
                                                    <FileTextIcon className="h-5 w-5 text-indigo-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {studentForReport && (
                <ReportCardModal 
                    exam={exam}
                    student={studentForReport.student}
                    results={results[studentForReport.student.id] || {}}
                    comment={comments[studentForReport.student.id]}
                    rank={studentForReport.rank}
                    totalStudents={MOCK_STUDENTS.length}
                    onClose={() => setStudentForReport(null)}
                />
            )}

            {isBulkUploadModalOpen && (
                <BulkUploadMarksModal
                    exam={exam}
                    onClose={() => setIsBulkUploadModalOpen(false)}
                    onImport={handleBulkUpdateResults}
                />
            )}
        </>
    );
};