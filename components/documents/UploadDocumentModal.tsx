
import React, { useState } from 'react';
import { Document, Student } from '../../types';
import { XIcon, DocumentStoreIcon } from '../icons';

interface UploadDocumentModalProps {
    students: Student[];
    onClose: () => void;
    onUpload: (docData: Omit<Document, 'id' | 'uploadDate' | 'fileUrl'>) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ students, onClose, onUpload }) => {
    const [studentId, setStudentId] = useState<string>(students[0]?.id || '');
    const [docName, setDocName] = useState('');
    const [docType, setDocType] = useState<Document['type']>('Admission Letter');
    const [fileName, setFileName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const student = students.find(s => s.id === studentId);
        if (!student || !docName || !fileName) {
            alert('Please fill out all fields and select a file.');
            return;
        }
        onUpload({
            name: docName,
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            type: docType,
        });
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
            // In a real app, you would handle the file object itself.
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center">
                        <DocumentStoreIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <h2 className="text-xl font-semibold text-slate-800">Upload New Document</h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <label htmlFor="studentId" className="block text-sm font-medium text-slate-700 mb-1">Select Student</label>
                        <select name="studentId" id="studentId" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required>
                            <option value="" disabled>-- Select a student --</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="docName" className="block text-sm font-medium text-slate-700 mb-1">Document Name</label>
                        <input type="text" name="docName" id="docName" value={docName} onChange={(e) => setDocName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" placeholder="e.g., John's Admission Letter" required />
                    </div>
                    <div>
                        <label htmlFor="docType" className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
                        <select name="docType" id="docType" value={docType} onChange={(e) => setDocType(e.target.value as any)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                            <option>Admission Letter</option>
                            <option>Transcript</option>
                            <option>Birth Certificate</option>
                            <option>Medical Report</option>
                        </select>
                    </div>
                    <div>
                         <label htmlFor="file-upload" className="block text-sm font-medium text-slate-700 mb-1">File</label>
                         <label htmlFor="file-upload" className="w-full flex items-center space-x-2 p-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                            <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md text-sm font-medium">Choose File</span>
                            <span className="text-sm text-slate-500 truncate">{fileName || 'No file selected'}</span>
                         </label>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                        Upload Document
                    </button>
                </div>
            </form>
        </div>
    );
};
