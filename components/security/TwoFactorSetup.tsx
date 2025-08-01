
import React, { useState } from 'react';
import { User } from '../../types';
import { LogoIcon } from '../icons';

interface TwoFactorSetupProps {
    user: User;
    onSuccess: () => void;
    onCancel: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ user, onSuccess, onCancel }) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=otpauth://totp/JafaSol:${user.email}?secret=${user.twoFactorSecret}&issuer=JafaSol`;

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        // Simulate OTP verification
        setTimeout(() => {
            if (otp.length === 6 && /^\d+$/.test(otp)) {
                onSuccess();
            } else {
                setError('Invalid OTP. Please enter the 6-digit code from your authenticator app.');
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-lg">
                <div className="text-center">
                    <LogoIcon className="mx-auto h-12 w-auto text-indigo-600" />
                    <h2 className="mt-6 text-3xl font-bold text-slate-900">Set Up Two-Factor Authentication</h2>
                    <p className="mt-2 text-sm text-slate-600">Enhance your account security.</p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-slate-50 rounded-lg">
                    <img src={qrCodeUrl} alt="QR Code for 2FA" className="w-40 h-40 border-4 border-white rounded-lg shadow-md" />
                    <div className="text-sm text-slate-700 flex-1">
                        <p className="font-semibold">1. Scan this QR code with an authenticator app (e.g., Google Authenticator).</p>
                        <p className="mt-2">If you can't scan, manually enter this key:</p>
                        <div className="mt-2 p-2 bg-slate-200 rounded font-mono text-center tracking-wider">{user.twoFactorSecret}</div>
                    </div>
                </div>
                <form onSubmit={handleVerify} className="space-y-4">
                    <p className="text-sm text-slate-600 font-semibold">2. Enter the 6-digit code from your app to complete setup.</p>
                    <div>
                        <label htmlFor="otp" className="sr-only">6-Digit Code</label>
                        <input id="otp" name="otp" type="text" maxLength={6} required value={otp} onChange={e => setOtp(e.target.value)} placeholder="123 456" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center text-2xl tracking-[.5em]"/>
                    </div>
                     {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex items-center gap-4 pt-2">
                        <button type="button" onClick={onCancel} className="w-full flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">Cancel</button>
                        <button type="submit" disabled={loading || otp.length !== 6} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Verifying...' : 'Verify & Enable'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TwoFactorSetup;
