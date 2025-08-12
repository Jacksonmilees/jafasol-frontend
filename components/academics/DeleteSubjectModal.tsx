import React, { useState } from 'react';
import { Subject } from '../../types';
import { XIcon, TrashIcon, ShieldAlertIcon } from '../icons';

interface DeleteSubjectModalProps {
    subject: Subject;
    onClose: () => void;
    onDelete: () => void;
}

export const DeleteSubjectModal: React.FC<DeleteSubjectModalProps> = ({ subject, onClose, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete();
        } catch (error) {
            console.error('Error deleting subject:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const isConfirmed = confirmationText === subject.name;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-red-100 p-2 rounded-full mr-3">
                            <TrashIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Delete Subject</h2>
                            <p className="text-gray-600 mt-1">This action cannot be undone</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
                        <XIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Warning */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <ShieldAlertIcon className="h-5 w-5 text-red-600 mt-0.5" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-900">Warning</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p className="mb-2">
                                        Deleting this subject will permanently remove:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>All timetable entries for this subject</li>
                                        <li>Subject assignment from teachers</li>
                                        <li>All related academic records</li>
                                        <li>Historical data and reports</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subject Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-gray-900 mb-2">Subject to be deleted:</h4>
                        <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Name:</span> {subject.name}</div>
                            <div><span className="font-medium">Code:</span> {subject.code || 'N/A'}</div>
                            <div><span className="font-medium">Category:</span> {subject.subjectCategory}</div>
                            <div><span className="font-medium">Form Levels:</span> {subject.formLevels?.join(', ') || 'N/A'}</div>
                            <div><span className="font-medium">Status:</span> 
                                <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                                    subject.status === 'Active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {subject.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type the subject name "<span className="font-bold text-red-600">{subject.name}</span>" to confirm deletion:
                        </label>
                        <input
                            type="text"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            placeholder={subject.name}
                            autoComplete="off"
                        />
                    </div>

                    {/* Impact Notice */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <ShieldAlertIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div className="ml-3">
                                <h4 className="text-sm font-medium text-yellow-900">Before you proceed</h4>
                                <p className="text-sm text-yellow-700 mt-1">
                                    Consider archiving the subject instead of deleting it to preserve historical data. 
                                    You can change the status to "Inactive" to stop it from appearing in new timetables.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            This action is permanent and cannot be undone
                        </div>
                        
                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            
                            <button
                                onClick={handleDelete}
                                disabled={!isConfirmed || isDeleting}
                                className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <TrashIcon className="h-4 w-4 mr-2" />
                                        Delete Subject
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



