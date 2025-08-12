import React from 'react';
import { XIcon, UserIcon, KeyIcon, PhoneIcon, ShieldCheckIcon, DownloadIcon, PrinterIcon } from '../icons';

interface TeacherCredentials {
    username: string;
    password: string;
    teacherId: string;
    name: string;
    email: string;
    role: string;
}

interface TeacherCredentialsModalProps {
    credentials: TeacherCredentials;
    onClose: () => void;
    onPrint?: () => void;
    onDownload?: () => void;
}

export const TeacherCredentialsModal: React.FC<TeacherCredentialsModalProps> = ({ 
    credentials, 
    onClose, 
    onPrint, 
    onDownload 
}) => {
    const handlePrint = () => {
        if (onPrint) {
            onPrint();
        } else {
            window.print();
        }
    };

    const handleDownload = () => {
        if (onDownload) {
            onDownload();
        } else {
            const content = `
Teacher Account Credentials
==========================

Teacher ID: ${credentials.teacherId}
Name: ${credentials.name}
Email: ${credentials.email}
Role: ${credentials.role}

Login Credentials:
Username: ${credentials.username}
Password: ${credentials.password}

Important Notes:
- Please change your password after first login
- Keep these credentials secure
- Contact administrator if you need assistance

Generated on: ${new Date().toLocaleDateString()}
            `;
            
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `teacher-credentials-${credentials.teacherId}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                            <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800">Teacher Account Created Successfully!</h2>
                            <p className="text-sm text-slate-600">Please save these credentials securely</p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="Close">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Success Message */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <ShieldCheckIcon className="h-5 w-5 text-green-600 mr-2" />
                                <p className="text-green-800 font-medium">Teacher account has been created successfully!</p>
                            </div>
                            <p className="text-green-700 text-sm mt-1">
                                The teacher can now log in using the credentials below. Please share these securely.
                            </p>
                        </div>

                        {/* Teacher Information */}
                        <div className="border border-slate-200 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                                <UserIcon className="h-5 w-5 mr-2" />
                                Teacher Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Teacher ID</label>
                                    <p className="text-lg font-semibold text-slate-800 bg-white px-3 py-2 rounded-lg border">
                                        {credentials.teacherId}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                                    <p className="text-lg font-semibold text-slate-800 bg-white px-3 py-2 rounded-lg border">
                                        {credentials.name}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
                                    <p className="text-lg font-semibold text-slate-800 bg-white px-3 py-2 rounded-lg border">
                                        {credentials.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Role</label>
                                    <p className="text-lg font-semibold text-slate-800 bg-white px-3 py-2 rounded-lg border">
                                        {credentials.role}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Login Credentials */}
                        <div className="border border-slate-200 rounded-xl p-6 bg-gradient-to-br from-amber-50 to-orange-50">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                                <KeyIcon className="h-5 w-5 mr-2" />
                                Login Credentials
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
                                    <div className="flex">
                                        <input 
                                            type="text" 
                                            value={credentials.username} 
                                            readOnly 
                                            className="flex-1 p-3 border border-slate-300 rounded-l-lg bg-white font-mono text-lg"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => navigator.clipboard.writeText(credentials.username)}
                                            className="px-4 py-3 bg-slate-100 border border-l-0 border-slate-300 rounded-r-lg hover:bg-slate-200 text-sm font-medium transition-colors"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
                                    <div className="flex">
                                        <input 
                                            type="text" 
                                            value={credentials.password} 
                                            readOnly 
                                            className="flex-1 p-3 border border-slate-300 rounded-l-lg bg-white font-mono text-lg"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => navigator.clipboard.writeText(credentials.password)}
                                            className="px-4 py-3 bg-slate-100 border border-l-0 border-slate-300 rounded-r-lg hover:bg-slate-200 text-sm font-medium transition-colors"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Important Notes */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h4 className="font-semibold text-amber-800 mb-2">Important Notes:</h4>
                            <ul className="text-amber-700 text-sm space-y-1">
                                <li>• Please change your password after first login for security</li>
                                <li>• Keep these credentials secure and don't share them publicly</li>
                                <li>• Contact the administrator if you need assistance</li>
                                <li>• These credentials are required for accessing the school management system</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-between items-center">
                    <div className="flex space-x-3">
                        <button 
                            type="button" 
                            onClick={handleDownload}
                            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                        >
                            <DownloadIcon className="h-4 w-4 mr-2" />
                            Download
                        </button>
                        <button 
                            type="button" 
                            onClick={handlePrint}
                            className="px-4 py-2 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors flex items-center"
                        >
                            <PrinterIcon className="h-4 w-4 mr-2" />
                            Print
                        </button>
                    </div>
                    
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};
