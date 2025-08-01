

import React, { useState, useMemo } from 'react';
import { User, Student, FeePayment } from '../../types';
import { MOCK_STUDENTS, MOCK_FEE_PAYMENTS, MOCK_FEE_INVOICES } from '../../constants';
import { PortalHeader } from './PortalHeader';
import { WelcomeBanner } from './WelcomeBanner';
import { AcademicResultsCard } from './AcademicResultsCard';
import { FeeStatusCard } from './FeeStatusCard';
import { StudentTimetable } from './StudentTimetable';
import { MpesaPaymentModal } from '../fees/MpesaPaymentModal';

interface ParentStudentPortalProps {
    user: User;
    users: User[];
    onSetCurrentUser: (user: User) => void;
    onLogout: () => void;
}

const ParentStudentPortal: React.FC<ParentStudentPortalProps> = ({ user, users, onSetCurrentUser, onLogout }) => {
    const student = MOCK_STUDENTS.find(s => s.id === user.studentId);
    const [payments, setPayments] = useState<FeePayment[]>(MOCK_FEE_PAYMENTS);
    const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);

    const feeSummary = useMemo(() => {
        if (!student) return { balance: 0 };
        const invoices = MOCK_FEE_INVOICES.filter(inv => inv.studentId === student.id);
        const studentPayments = payments.filter(pay => pay.studentId === student.id);

        const totalBilled = invoices.reduce((acc, inv) => acc + inv.amount, 0);
        const totalPaid = studentPayments.reduce((acc, pay) => acc + pay.amount, 0);
        const balance = totalBilled - totalPaid;
        return { balance };
    }, [student, payments]);


    if (!student) {
        return (
            <div className="bg-slate-100 min-h-screen flex flex-col">
                <PortalHeader currentUser={user} users={users} onSetCurrentUser={onSetCurrentUser} onLogout={onLogout} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center p-8 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-red-600">Error</h2>
                        <p className="text-slate-600 mt-2">Could not find linked student data for this user account.</p>
                    </div>
                </div>
            </div>
        );
    }

    const handleSuccessfulPayment = (amount: number) => {
        const newPayment: FeePayment = {
            id: `PAY-MPESA-${Date.now()}`,
            studentId: student.id,
            amount,
            method: 'Mpesa',
            date: new Date().toISOString().split('T')[0],
        };
        setPayments(prev => [...prev, newPayment]);
    };
    
    return (
        <>
        <div className="bg-slate-100 min-h-screen">
            <PortalHeader currentUser={user} users={users} onSetCurrentUser={onSetCurrentUser} onLogout={onLogout} />
            <main className="p-4 sm:p-6 lg:p-8">
                <WelcomeBanner user={user} student={student} />

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <AcademicResultsCard student={student} />
                        <FeeStatusCard 
                            student={student} 
                            payments={payments.filter(p => p.studentId === student.id)}
                            onPayClick={() => setIsMpesaModalOpen(true)}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1">
                        <StudentTimetable student={student} />
                    </div>
                </div>
            </main>
        </div>
        {isMpesaModalOpen && (
            <MpesaPaymentModal
                student={student}
                balance={feeSummary.balance}
                onClose={() => setIsMpesaModalOpen(false)}
                onPaymentSuccess={handleSuccessfulPayment}
            />
        )}
        </>
    );
};

export default ParentStudentPortal;