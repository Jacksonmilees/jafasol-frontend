
import React from 'react';
import { Student, FeePayment } from '../../types';
import { XIcon, LogoIcon, PrinterIcon } from '../icons';

interface ReceiptModalProps {
    student: Student;
    payment: FeePayment;
    onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ student, payment, onClose }) => {
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 non-printable">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-800">Payment Receipt</h2>
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
                    <div className="p-8 bg-white printable-area" id="payment-receipt">
                        {/* Header */}
                        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
                            <div className="flex items-center">
                                <LogoIcon className="h-16 w-16 text-indigo-600" />
                                <div className="ml-4">
                                    <h1 className="text-3xl font-bold text-slate-800">GREEN VALLEY HIGH SCHOOL</h1>
                                    <p className="text-slate-500">Official Payment Receipt</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">Receipt #: {payment.id}</p>
                                <p className="text-sm text-slate-600">Date: {new Date(payment.date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Student Details */}
                         <div className="my-6">
                            <p className="text-sm text-slate-500 mb-1">Received From:</p>
                            <h3 className="text-lg font-semibold text-slate-800">{student.firstName} {student.lastName}</h3>
                            <p className="text-sm text-slate-600">Admission No: {student.admissionNumber} | Class: {student.formClass} {student.stream}</p>
                        </div>

                        {/* Payment Table */}
                        <table className="w-full text-sm text-left border-collapse border border-slate-300 mt-4">
                             <thead className="bg-slate-100 text-slate-600 uppercase">
                                <tr>
                                    <th className="p-2 border border-slate-300">Description</th>
                                    <th className="p-2 border border-slate-300">Payment Method</th>
                                    <th className="p-2 border border-slate-300 text-right">Amount Paid (KES)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-slate-300">
                                    <td className="p-2 border-r border-slate-300">Payment towards school fees</td>
                                    <td className="p-2 border-r border-slate-300">{payment.method}</td>
                                    <td className="p-2 text-right font-semibold">{payment.amount.toLocaleString('en-US')}</td>
                                </tr>
                            </tbody>
                            <tfoot className="bg-slate-100 font-bold">
                                <tr>
                                    <td colSpan={2} className="p-2 border border-slate-300 text-right">Total Amount Received:</td>
                                    <td className="p-2 border border-slate-300 text-right text-lg text-indigo-600">
                                        {payment.amount.toLocaleString('en-US', { style: 'currency', currency: 'KES' })}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                        
                        <div className="flex justify-between items-end mt-16">
                             <div className="text-xs text-slate-500">
                                <p>Thank you for your prompt payment.</p>
                                <p>This is a computer-generated receipt.</p>
                            </div>
                            <div className="text-center">
                                <p className="border-t-2 border-slate-400 border-dotted pt-1">.......................................</p>
                                <p className="text-sm font-semibold">Bursar's Office</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
