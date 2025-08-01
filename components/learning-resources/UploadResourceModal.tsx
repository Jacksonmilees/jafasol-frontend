
import React, { useState, useEffect } from 'react';
import { LearningResource } from '../../types';
import { MOCK_SUBJECTS, MOCK_CLASSES } from '../../constants';
import { XIcon, BookMarkedIcon } from '../icons';

interface UploadResourceModalProps {
    resource: LearningResource | null;
    onClose: () => void;
    onSave: (data: Omit<LearningResource, 'id' | 'uploadDate' | 'uploaderName'>, id?: string) => void;
}

export const UploadResourceModal: React.FC<UploadResourceModalProps> = ({ resource, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: MOCK_SUBJECTS[0]?.name || '',
        formClass: MOCK_CLASSES[0]?.name || 'All Forms',
        resourceType: 'Notes (PDF)' as LearningResource['resourceType'],
        fileUrl: '', // For video links
    });

    useEffect(() => {
        if (resource) {
            setFormData({
                title: resource.title,
                description: resource.description,
                subject: resource.subject,
                formClass: resource.formClass,
                resourceType: resource.resourceType,
                fileUrl: resource.resourceType === 'Video Link' ? resource.fileUrl : '',
            });
        }
    }, [resource]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            fileUrl: formData.resourceType === 'Video Link' ? formData.fileUrl : '#',
        };
        onSave(dataToSave, resource?.id);
    }
    
    const isEditing = resource !== null;
    const isVideoLink = formData.resourceType === 'Video Link';

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center">
                        <BookMarkedIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <h2 className="text-xl font-semibold text-slate-800">{isEditing ? 'Edit' : 'Upload'} Resource</h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                            <select name="subject" id="subject" value={formData.subject} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                                {MOCK_SUBJECTS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="formClass" className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                            <select name="formClass" id="formClass" value={formData.formClass} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                                <option>All Forms</option>
                                {MOCK_CLASSES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="resourceType" className="block text-sm font-medium text-slate-700 mb-1">Resource Type</label>
                        <select name="resourceType" id="resourceType" value={formData.resourceType} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                            <option>Notes (PDF)</option>
                            <option>Assignment (DOC)</option>
                            <option>Video Link</option>
                        </select>
                    </div>
                    {isVideoLink ? (
                         <div>
                            <label htmlFor="fileUrl" className="block text-sm font-medium text-slate-700 mb-1">Video URL</label>
                            <input type="url" name="fileUrl" id="fileUrl" value={formData.fileUrl} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" placeholder="https://example.com/video" required />
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="file-upload" className="block text-sm font-medium text-slate-700 mb-1">File Upload</label>
                            <label htmlFor="file-upload" className="w-full flex items-center space-x-2 p-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                                <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md text-sm font-medium">Choose File</span>
                                <span className="text-sm text-slate-500 truncate">No file selected (simulation)</span>
                            </label>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </div>
                    )}
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">{isEditing ? 'Save Changes' : 'Upload'}</button>
                </div>
            </form>
        </div>
    );
};
