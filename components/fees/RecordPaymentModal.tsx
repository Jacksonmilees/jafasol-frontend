
import React, { useState } from 'react';
import { Student } from '../../types';
import { XIcon, CreditCardIcon } from '../icons';

interface RecordPaymentModalProps {
    student: Student;
    onClose: () => void;
    onSave: (student: Student, amount: number, method: 'Mpesa' | 'Bank' | 'Cash', date: string) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ student, onClose, onSave }) => {
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<'Mpesa' | 'Bank' | 'Cash'>('Mpesa');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const paymentAmount = parseFloat(amount);
        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            alert("Please enter a valid payment amount.");
            return;
        }
        onSave(student, paymentAmount, method, date);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center">
                        <CreditCardIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800">Record Payment</h2>
                            <p className="text-sm text-slate-500">For: {student.firstName} {student.lastName}</p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Amount (KES)</label>
                        <input type="number" name="amount" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="method" className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                            <select name="method" id="method" value={method} onChange={(e) => setMethod(e.target.value as any)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                                <option>Mpesa</option>
                                <option>Bank</option>
                                <option>Cash</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Payment Date</label>
                            <input type="date" name="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                        Save Payment
                    </button>
                </div>
            </form>
        </div>
    );
};