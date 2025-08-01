import React, { useState } from 'react';
import { Student, User } from '../types';
import { MOCK_ROLES } from '../constants';
import { LogoIcon, GraduationCapIcon, PhoneIcon, KeyIcon } from './icons';

interface RegisterProps {
    students: Student[];
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    onSwitchToLogin: () => void;
    onRegisterSuccess: () => void;
}

const ProgressBar: React.FC<{ step: number }> = ({ step }) => {
    const steps = ['Verify Identity', 'Enter OTP', 'Create Account'];
    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
                {steps.map((name, index) => (
                <li key={name} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                    {index < step ? (
                        <>
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="h-0.5 w-full bg-indigo-600" />
                        </div>
                        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-900">
                           <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                             <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                           </svg>
                        </div>
                        </>
                    ) : index === step ? (
                         <>
                         <div className="absolute inset-0 flex items-center" aria-hidden="true">
                           <div className="h-0.5 w-full bg-gray-200" />
                         </div>
                         <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white" aria-current="step">
                            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" aria-hidden="true" />
                         </div>
                       </>
                    ) : (
                        <>
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="h-0.5 w-full bg-gray-200" />
                        </div>
                        <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400">
                          <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" aria-hidden="true" />
                        </div>
                      </>
                    )}
                </li>
                ))}
            </ol>
        </nav>
    );
}


export const Register: React.FC<RegisterProps> = ({ students, setStudents, users, setUsers, onSwitchToLogin, onRegisterSuccess }) => {
    const [step, setStep] = useState(0); // 0: Verify, 1: OTP, 2: Create
    const [admissionNumber, setAdmissionNumber] = useState('');
    const [guardianPhone, setGuardianPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifiedStudent, setVerifiedStudent] = useState<Student | null>(null);

    const handleVerifyDetails = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => { // Simulate API call
            const student = students.find(s => 
                s.admissionNumber.toLowerCase() === admissionNumber.toLowerCase() &&
                s.guardianPhone === guardianPhone
            );

            if (!student) {
                setError('Admission number or guardian phone not found.');
            } else if (student.isRegistered) {
                setError('An account already exists for this student. Please log in.');
            } else {
                setVerifiedStudent(student);
                setStep(1);
            }
            setLoading(false);
        }, 1000);
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => { // Simulate API call
            if (otp.length === 6 && /^\d+$/.test(otp)) {
                setStep(2);
            } else {
                setError('Invalid OTP. Please enter the 6-digit code.');
            }
            setLoading(false);
        }, 1000);
    };

     const handleCreateAccount = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);

        setTimeout(() => {
            if (!verifiedStudent) {
                setError('An unexpected error occurred. Please start over.');
                setLoading(false);
                return;
            }
            
            const studentRole = MOCK_ROLES.find(r => r.name === 'Student');
            if (!studentRole) {
                 setError('System configuration error: Student role not found.');
                 setLoading(false);
                 return;
            }

            const newUser: User = {
                id: `U${(users.length + 10).toString().padStart(3, '0')}`,
                name: `${verifiedStudent.firstName} ${verifiedStudent.lastName}`,
                email: `${verifiedStudent.firstName.charAt(0).toLowerCase()}.${verifiedStudent.lastName.toLowerCase()}@student.jafasol.com`,
                role: studentRole,
                status: 'Active',
                avatarUrl: verifiedStudent.avatarUrl,
                studentId: verifiedStudent.id,
            };

            setUsers(prevUsers => [...prevUsers, newUser]);
            setStudents(prevStudents => prevStudents.map(s => s.id === verifiedStudent.id ? {...s, isRegistered: true} : s));
            
            setLoading(false);
            alert(`Account created for ${newUser.name}!\nYou can now log in with the email: ${newUser.email}`);
            onRegisterSuccess();
        }, 1500);
    };

    const renderStep = () => {
        switch(step) {
            case 0: return (
                <form onSubmit={handleVerifyDetails} className="space-y-6">
                    <div>
                        <label htmlFor="admissionNumber" className="block text-sm font-medium text-slate-700">Admission Number</label>
                        <input id="admissionNumber" name="admissionNumber" type="text" required value={admissionNumber} onChange={e => setAdmissionNumber(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                     <div>
                        <label htmlFor="guardianPhone" className="block text-sm font-medium text-slate-700">Guardian's Phone Number</label>
                        <input id="guardianPhone" name="guardianPhone" type="tel" required value={guardianPhone} onChange={e => setGuardianPhone(e.target.value)} placeholder="0712345678" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </form>
            );
            case 1: return (
                 <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <p className="text-sm text-center text-slate-600">A 6-digit verification code has been sent to <span className="font-bold">{guardianPhone}</span>.</p>
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-slate-700">Verification Code (OTP)</label>
                        <input id="otp" name="otp" type="text" maxLength={6} required value={otp} onChange={e => setOtp(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        {loading ? 'Confirming...' : 'Confirm OTP'}
                    </button>
                </form>
            );
            case 2: return (
                 <form onSubmit={handleCreateAccount} className="space-y-6">
                     <p className="text-sm text-center text-slate-600">Create a password for <span className="font-bold">{verifiedStudent?.firstName}</span>'s portal account.</p>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                        <input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">Confirm Password</label>
                        <input id="confirmPassword" name="confirmPassword" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
            );
            default: return null;
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
            <div className="w-full max-w-lg">
                <div className="p-8 space-y-8 bg-white rounded-2xl shadow-lg">
                    <div className="text-center">
                        <LogoIcon className="mx-auto h-12 w-auto text-indigo-600" />
                        <h2 className="mt-6 text-3xl font-bold text-slate-900">
                           Create Student Account
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                           Follow the steps to set up your JafaSol portal access.
                        </p>
                    </div>
                    <ProgressBar step={step} />
                     {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    <div className="pt-4">
                         {renderStep()}
                    </div>
                </div>
                 <div className="mt-4 text-center text-sm text-slate-600">
                    <p>
                        Already have an account?{' '}
                        <button onClick={onSwitchToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};