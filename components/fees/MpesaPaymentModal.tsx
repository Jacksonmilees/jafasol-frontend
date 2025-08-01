
import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { XIcon, MpesaIcon } from '../icons';

interface MpesaPaymentModalProps {
    student: Student;
    balance: number;
    onClose: () => void;
    onPaymentSuccess: (amount: number) => void;
}

type PaymentStatus = 'idle' | 'pending' | 'success' | 'error';

export const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({ student, balance, onClose, onPaymentSuccess }) => {
    const [amount, setAmount] = useState(balance > 0 ? balance.toString() : '');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<PaymentStatus>('idle');
    const [error, setError] = useState('');

    const handlePayment = () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }
        if (!/^(07|01)\d{8}$/.test(phone)) {
            setError("Please enter a valid Safaricom number (e.g., 07... or 01...).");
            return;
        }
        
        setError('');
        setStatus('pending');
        
        // Simulate STK push and confirmation
        setTimeout(() => {
            onPaymentSuccess(numericAmount);
            setStatus('success');
        }, 3000); // 3-second delay to simulate network latency
    };
    
    const IdleContent = () => (
        <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <p className="text-center text-sm text-slate-600">You are paying for <span className="font-bold">{student.firstName} {student.lastName}</span>.</p>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">M-Pesa Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                        placeholder="0712345678"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Amount to Pay (KES)</label>
                    <input
                        type="number"
                        name="amount"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                        required
                    />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-between items-center">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition">
                    Cancel
                </button>
                <button type="button" onClick={handlePayment} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition">
                    Pay {parseFloat(amount || '0').toLocaleString('en-US', { style: 'currency', currency: 'KES'})}
                </button>
            </div>
        </>
    );

    const PendingContent = () => (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-800">Confirm on Your Phone</h3>
            <p className="text-slate-600 mt-1">An STK push has been sent to <span className="font-bold">{phone}</span>. Please enter your M-Pesa PIN to authorize the payment of <span className="font-bold">KES {amount}</span>.</p>
        </div>
    );

    const SuccessContent = () => (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Payment Successful!</h3>
            <p className="text-slate-600 mt-1">Thank you. The fee balance has been updated.</p>
             <div className="mt-6 w-full">
                 <button type="button" onClick={onClose} className="w-full px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition">
                    Done
                </button>
             </div>
        </div>
    );
    
    const renderContent = () => {
        switch(status) {
            case 'pending': return <PendingContent />;
            case 'success': return <SuccessContent />;
            default: return <IdleContent />;
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <div className="flex items-center">
                        <MpesaIcon className="h-7 w-7 text-green-600 mr-2" />
                        <h2 className="text-xl font-semibold text-slate-800">Pay with M-PESA</h2>
                    </div>
                    {status === 'idle' && (
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                            <XIcon className="h-6 w-6 text-slate-500" />
                        </button>
                    )}
                </div>
                {renderContent()}
            </div>
        </div>
    );
};
