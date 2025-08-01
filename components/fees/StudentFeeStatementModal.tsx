
import React, { useMemo, useState } from 'react';
import { Student, FeePayment } from '../../types';
import { MOCK_FEE_INVOICES, MOCK_FEE_PAYMENTS, MOCK_ACADEMIC_YEAR } from '../../constants';
import { XIcon, LogoIcon, PrinterIcon } from '../icons';
import { ReceiptModal } from './ReceiptModal';


interface StudentFeeStatementModalProps {
    student: Student;
    onClose: () => void;
}

export const StudentFeeStatementModal: React.FC<StudentFeeStatementModalProps> = ({ student, onClose }) => {
    const [receiptPayment, setReceiptPayment] = useState<FeePayment | null>(null);

    const handlePrint = () => {
        window.print();
    };

    const statementData = useMemo(() => {
        const invoices = MOCK_FEE_INVOICES.filter(inv => inv.studentId === student.id);
        const payments = MOCK_FEE_PAYMENTS.filter(pay => pay.studentId === student.id);

        const allTransactions = [
            ...invoices.map(inv => ({ ...inv, type: 'invoice' as const })),
            ...payments.map(pay => ({ ...pay, type: 'payment' as const }))
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let balance = 0;
        const transactionsWithBalance = allTransactions.map(t => {
            if (t.type === 'invoice') {
                balance += t.amount;
            } else {
                balance -= t.amount;
            }
            return { ...t, balance };
        });

        const totalBilled = invoices.reduce((acc, inv) => acc + inv.amount, 0);
        const totalPaid = payments.reduce((acc, pay) => acc + pay.amount, 0);
        const finalBalance = totalBilled - totalPaid;
        
        return { transactionsWithBalance, finalBalance };

    }, [student.id]);

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 non-printable">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-between p-4 border-b border-slate-200">
                        <h2 className="text-xl font-semibold text-slate-800">Student Fee Statement</h2>
                        <div className="flex items-center space-x-2">
                            <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
                                <PrinterIcon className="h-5 w-5 mr-2" />
                                Print Statement
                            </button>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                                <XIcon className="h-6 w-6 text-slate-500" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        <div className="p-6 bg-white printable-area" id="fee-statement">
                            <div className="flex justify-between items-center border-b-2 border-slate-800 pb-4">
                                <div className="flex items-center">
                                    <LogoIcon className="h-16 w-16 text-indigo-600" />
                                    <div className="ml-4">
                                        <h1 className="text-3xl font-bold text-slate-800">GREEN VALLEY HIGH SCHOOL</h1>
                                        <p className="text-slate-500">Official Fee Statement</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">Date: {new Date().toLocaleDateString()}</p>
                                    <p className="text-sm text-slate-600">Academic Year: {MOCK_ACADEMIC_YEAR.year}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 my-6 text-sm">
                                <div><span className="font-semibold">Student Name:</span> {student.firstName} {student.lastName}</div>
                                <div><span className="font-semibold">Admission No:</span> {student.admissionNumber}</div>
                                <div><span className="font-semibold">Class:</span> {student.formClass} {student.stream}</div>
                            </div>

                            <table className="w-full text-sm text-left border-collapse border border-slate-300">
                                <thead className="bg-slate-100 text-slate-600 uppercase">
                                    <tr>
                                        <th className="p-2 border border-slate-300">Date</th>
                                        <th className="p-2 border border-slate-300">Description</th>
                                        <th className="p-2 border border-slate-300 text-right">Invoice (KES)</th>
                                        <th className="p-2 border border-slate-300 text-right">Payment (KES)</th>
                                        <th className="p-2 border border-slate-300 text-right">Balance (KES)</th>
                                        <th className="p-2 border border-slate-300 text-center non-printable">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statementData.transactionsWithBalance.map(t => (
                                        <tr key={t.id} className="border-b border-slate-300">
                                            <td className="p-2 border-r border-slate-300">{new Date(t.date).toLocaleDateString()}</td>
                                            <td className="p-2 border-r border-slate-300">{t.type === 'invoice' ? t.description : `Payment via ${t.method}`}</td>
                                            <td className="p-2 border-r border-slate-300 text-right">{t.type === 'invoice' ? t.amount.toLocaleString() : '-'}</td>
                                            <td className="p-2 border-r border-slate-300 text-right">{t.type === 'payment' ? t.amount.toLocaleString() : '-'}</td>
                                            <td className="p-2 border-r border-slate-300 text-right font-medium">{t.balance.toLocaleString()}</td>
                                            <td className="p-2 text-center non-printable">
                                                {t.type === 'payment' && (
                                                     <button 
                                                        onClick={() => setReceiptPayment(t as FeePayment)}
                                                        className="px-2 py-1 text-xs bg-white text-slate-700 border border-slate-300 rounded-md hover:bg-slate-100 transition">
                                                        Receipt
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-slate-100 font-bold">
                                    <tr>
                                        <td colSpan={5} className="p-2 border border-slate-300 text-right">Final Balance Due:</td>
                                        <td className="p-2 border border-slate-300 text-right text-lg text-indigo-600">
                                            {statementData.finalBalance.toLocaleString('en-US', { style: 'currency', currency: 'KES' })}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                            
                            <div className="mt-12 text-xs text-slate-500">
                                <p>Please make all payments to the school bank account or via the official Mpesa paybill.</p>
                                <p>This is a computer-generated statement and does not require a signature.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {receiptPayment && (
                <ReceiptModal 
                    student={student}
                    payment={receiptPayment}
                    onClose={() => setReceiptPayment(null)}
                />
            )}
        </>
    );
};
