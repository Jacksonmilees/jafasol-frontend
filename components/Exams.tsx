import React, { useState } from 'react';
import { MOCK_EXAMS } from '../constants';
import { PlusIcon } from './icons';
import { ExamRow } from './exams/ExamRow';
import { ExamResults } from './exams/ExamResults';
import { Exam, User } from '../types';

interface ExamsProps {
    currentUser: User;
}

const Exams: React.FC<ExamsProps> = ({ currentUser }) => {
    const [exams, setExams] = useState<Exam[]>(MOCK_EXAMS);
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

    const handleManageResults = (exam: Exam) => {
        if (exam.status === 'Completed') {
            setSelectedExam(exam);
        } else {
            alert("You can only manage results for completed exams.");
        }
    };

    const handleToggleLock = (examId: string) => {
        setExams(prevExams => prevExams.map(exam =>
            exam.id === examId ? { ...exam, marksLocked: !exam.marksLocked } : exam
        ));
    };
    
    if (selectedExam) {
        const currentExamState = exams.find(e => e.id === selectedExam.id) || selectedExam;
        return <ExamResults exam={currentExamState} onBack={() => setSelectedExam(null)} currentUser={currentUser} />;
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
            <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Examinations</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage exam schedules and results entry.</p>
                </div>
                <button className="flex items-center justify-center px-4 py-2 mt-4 md:mt-0 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition whitespace-nowrap">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Schedule Exam
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th scope="col" className="py-3 px-6 font-medium">Exam Name</th>
                            <th scope="col" className="py-3 px-6 font-medium">Term</th>
                            <th scope="col" className="py-3 px-6 font-medium">Start Date</th>
                            <th scope="col" className="py-3 px-6 font-medium">Status</th>
                            <th scope="col" className="py-3 px-6 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {exams.map(exam => (
                            <ExamRow 
                                key={exam.id} 
                                exam={exam} 
                                onManageResults={handleManageResults}
                                onToggleLock={handleToggleLock}
                                currentUser={currentUser}
                             />
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                <p>Showing 1 to {exams.length} of {exams.length} results</p>
                <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">Previous</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">Next</button>
                </div>
            </div>
        </div>
    );
};

export default Exams;