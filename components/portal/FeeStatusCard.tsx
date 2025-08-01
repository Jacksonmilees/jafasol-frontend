
import React, { useMemo, useState } from 'react';
import { Student, FeePayment } from '../../types';
import { MOCK_FEE_INVOICES } from '../../constants';
import { FeesIcon, FileTextIcon, MpesaIcon } from '../icons';
import { StudentFeeStatementModal } from '../fees/StudentFeeStatementModal';

interface FeeStatusCardProps {
    student: Student;
    payments: FeePayment[];
    onPayClick: () => void;
}

export const FeeStatusCard: React.FC<FeeStatusCardProps> = ({ student, payments, onPayClick }) => {
    const [isStatementOpen, setIsStatementOpen] = useState(false);

    const feeSummary = useMemo(() => {
        const invoices = MOCK_FEE_INVOICES.filter(inv => inv.studentId === student.id);
        
        const totalBilled = invoices.reduce((acc, inv) => acc + inv.amount, 0);
        const totalPaid = payments.reduce((acc, pay) => acc + pay.amount, 0);
        const balance = totalBilled - totalPaid;
        const lastPayment = [...payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        
        return { balance, lastPayment };
    }, [student.id, payments]);

    const balanceColor = feeSummary.balance > 0 ? 'text-red-600' : 'text-green-600';

    return (
        <>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm">
            <div className="p-4 md:p-6 border-b border-slate-200">
                <div className="flex items-center">
                    <FeesIcon className="h-6 w-6 text-green-500 mr-3" />
                    <h3 className="text-lg font-semibold text-slate-800">Fee Status</h3>
                </div>
            </div>
            <div className="p-4 md:p-6 space-y-4">
                <div className="text-center">
                    <p className="text-sm text-slate-500">Current Balance</p>
                    <p className={`text-4xl font-bold mt-1 ${balanceColor}`}>
                        {feeSummary.balance.toLocaleString('en-US', { style: 'currency', currency: 'KES' })}
                    </p>
                </div>
                 {feeSummary.balance > 0 && (
                     <div className="text-center">
                        <button 
                            onClick={onPayClick}
                            className="inline-flex items-center justify-center px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-transform hover:scale-105"
                        >
                            <MpesaIcon className="h-6 w-6 mr-2 fill-white" />
                            Pay with M-PESA
                        </button>
                    </div>
                )}
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg">
                    <div>
                        <p className="text-sm font-medium text-slate-700">Last Payment</p>
                        {feeSummary.lastPayment ? (
                             <p className="text-sm text-slate-500">
                                {feeSummary.lastPayment.amount.toLocaleString('en-US', { style: 'currency', currency: 'KES' })} on {new Date(feeSummary.lastPayment.date).toLocaleDateString()}
                            </p>
                        ) : (
                            <p className="text-sm text-slate-500 italic">No payments recorded</p>
                        )}
                    </div>
                    <button 
                        onClick={() => setIsStatementOpen(true)}
                        className="flex items-center justify-center px-3 py-1.5 bg-white text-slate-700 text-sm font-medium rounded-md border border-slate-300 hover:bg-slate-100 transition whitespace-nowrap"
                    >
                        <FileTextIcon className="h-4 w-4 mr-2" />
                        View Statement
                    </button>
                </div>
            </div>
        </div>
        {isStatementOpen && <StudentFeeStatementModal student={student} onClose={() => setIsStatementOpen(false)} />}
        </>
    );
};
