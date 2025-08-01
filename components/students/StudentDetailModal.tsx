import React, { useState } from 'react';
import { Student, FeeInvoice, FeePayment } from '../../types';
import { XIcon, GraduationCapIcon, FileTextIcon, ChevronDownIcon, PhoneIcon } from '../icons';
import { MOCK_EXAMS, MOCK_FEE_INVOICES, MOCK_FEE_PAYMENTS } from '../../constants';
import { StudentFeeStatementModal } from '../fees/StudentFeeStatementModal';

const AccordionSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-t border-gray-200">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 text-left">
                <h4 className="text-base font-semibold text-gray-700">{title}</h4>
                <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="pb-4">{children}</div>}
        </div>
    )
}

const AcademicHistory: React.FC<{ student: Student }> = ({ student }) => {
    const examRecords = student.examResults || {};
    const examIdsWithResults = Object.keys(examRecords);

    if (examIdsWithResults.length === 0) {
        return <p className="mt-2 text-sm text-gray-500 italic">No exam results recorded for this student yet.</p>;
    }

    return (
        <div className="space-y-4">
            {examIdsWithResults.map(examId => {
                const exam = MOCK_EXAMS.find(e => e.id === examId);
                if (!exam) return null;

                const studentResults = examRecords[examId].results;
                const scores = Object.values(studentResults).filter(s => s !== null) as number[];
                const total = scores.reduce((acc, score) => acc + score, 0);
                const average = scores.length > 0 ? (total / scores.length).toFixed(1) : 'N/A';
                
                return (
                    <div key={examId} className="bg-gray-50/80 p-3 rounded-lg">
                        <p className="font-semibold text-gray-700">{exam.name}</p>
                        <p className="text-sm text-gray-500">{exam.term}</p>
                        <p className="text-sm text-gray-600 mt-1">Average Score: <span className="font-bold text-teal-600">{average}%</span></p>
                    </div>
                )
            })}
        </div>
    )
}

const FeeStatus: React.FC<{ student: Student, onOpenStatement: () => void }> = ({ student, onOpenStatement }) => {
    const invoices = MOCK_FEE_INVOICES.filter(inv => inv.studentId === student.id);
    const payments = MOCK_FEE_PAYMENTS.filter(pay => pay.studentId === student.id);

    const totalBilled = invoices.reduce((acc, inv) => acc + inv.amount, 0);
    const totalPaid = payments.reduce((acc, pay) => acc + pay.amount, 0);
    const balance = totalBilled - totalPaid;

    const balanceColor = balance > 0 ? 'text-red-600' : 'text-green-600';

    return (
        <div className="flex items-center justify-between bg-gray-50/80 p-3 rounded-lg">
            <div>
                 <p className="text-sm text-gray-600">Current Balance</p>
                 <p className={`text-2xl font-bold ${balanceColor}`}>{balance.toLocaleString('en-US', { style: 'currency', currency: 'KES' })}</p>
            </div>
            <button
                onClick={onOpenStatement}
                className="flex items-center justify-center px-3 py-2 bg-white text-gray-700 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition whitespace-nowrap"
            >
                <FileTextIcon className="h-4 w-4 mr-2" />
                View Statement
            </button>
        </div>
    )
}


export const StudentDetailModal: React.FC<{ student: Student; onClose: () => void; }> = ({ student, onClose }) => {
    const statusColor = student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    const [isStatementOpen, setIsStatementOpen] = useState(false);

    return (
        <>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="student-profile-title">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <GraduationCapIcon className="h-6 w-6 text-teal-600 mr-3" />
                        <h2 id="student-profile-title" className="text-xl font-semibold text-gray-800">Student Profile</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-2">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start pb-6">
                        <img className="h-28 w-28 rounded-full object-cover border-4 border-gray-100" src={student.avatarUrl} alt={`${student.firstName} ${student.lastName}`} />
                        <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                            <h3 className="text-2xl font-bold text-gray-900">{student.firstName} {student.lastName}</h3>
                            <p className="text-sm text-gray-500">Admission No: {student.admissionNumber}</p>
                            <span className={`mt-2 inline-block px-3 py-1 text-sm font-medium rounded-full ${statusColor}`}>
                                {student.status}
                            </span>
                        </div>
                    </div>
                    
                    <AccordionSection title="Personal & Academic Details">
                         <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Form & Stream</dt>
                                <dd className="mt-1 text-sm text-gray-900">{student.formClass} {student.stream}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Enrollment Date</dt>
                                <dd className="mt-1 text-sm text-gray-900">{student.enrollmentDate}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                                <dd className="mt-1 text-sm text-gray-900">{student.dateOfBirth}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                                <dd className="mt-1 text-sm text-gray-900">{student.gender}</dd>
                            </div>
                        </dl>
                    </AccordionSection>

                    <AccordionSection title="Guardian Information">
                        <div className="bg-gray-50/80 p-3 rounded-lg">
                             <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Guardian Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900 font-semibold">{student.guardianName || 'N/A'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Guardian Phone</dt>
                                    <dd className="mt-1 text-sm text-gray-900 font-semibold flex items-center">
                                        <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                                        {student.guardianPhone || 'N/A'}
                                    </dd>
                                </div>
                             </dl>
                         </div>
                    </AccordionSection>
                    
                    <AccordionSection title="Fee Status">
                         <FeeStatus student={student} onOpenStatement={() => setIsStatementOpen(true)} />
                    </AccordionSection>

                     <AccordionSection title="Academic History" defaultOpen>
                         <AcademicHistory student={student} />
                    </AccordionSection>

                    <AccordionSection title="Attendance Log">
                        <p className="text-sm text-gray-500 italic">Attendance log feature is under development.</p>
                    </AccordionSection>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex justify-end">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-100 transition">
                        Close
                    </button>
                </div>
            </div>
        </div>
        {isStatementOpen && <StudentFeeStatementModal student={student} onClose={() => setIsStatementOpen(false)} />}
        </>
    );
};