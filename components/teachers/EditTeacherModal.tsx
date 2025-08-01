
import React, { useState, useEffect } from 'react';
import { Teacher } from '../../types';
import { MOCK_SUBJECTS, MOCK_CLASSES } from '../../constants';
import { XIcon, PencilIcon } from '../icons';

interface EditTeacherModalProps {
    teacher: Teacher;
    onClose: () => void;
    onUpdateTeacher: (teacher: Teacher) => void;
}

export const EditTeacherModal: React.FC<EditTeacherModalProps> = ({ teacher, onClose, onUpdateTeacher }) => {
    const [formData, setFormData] = useState<Omit<Teacher, 'id' | 'avatarUrl'>>({
        name: '',
        email: '',
        subjects: [],
        classes: [],
        status: 'Active',
    });

    useEffect(() => {
        if (teacher) {
            setFormData({
                name: teacher.name,
                email: teacher.email,
                subjects: teacher.subjects,
                classes: teacher.classes,
                status: teacher.status,
            });
        }
    }, [teacher]);

    const handleSubjectToggle = (subjectName: string) => {
        setFormData(prev => {
            const newSubjects = prev.subjects.includes(subjectName)
                ? prev.subjects.filter(s => s !== subjectName)
                : [...prev.subjects, subjectName];
            return { ...prev, subjects: newSubjects };
        });
    };

    const handleClassToggle = (className: string) => {
        setFormData(prev => {
            const newClasses = prev.classes.includes(className)
                ? prev.classes.filter(c => c !== className)
                : [...prev.classes, className];
            return { ...prev, classes: newClasses };
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateTeacher({ ...teacher, ...formData });
    };
    
    if (!teacher) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center">
                        <PencilIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <h2 className="text-xl font-semibold text-slate-800">Edit Teacher Details</h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg" required />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Assigned Subjects</label>
                            <div className="max-h-40 overflow-y-auto space-y-2 p-3 border border-slate-300 rounded-lg">
                                {MOCK_SUBJECTS.map(subject => (
                                    <label key={subject.id} className="flex items-center space-x-3 cursor-pointer">
                                        <input type="checkbox" checked={formData.subjects.includes(subject.name)} onChange={() => handleSubjectToggle(subject.name)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"/>
                                        <span className="text-sm text-slate-600">{subject.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Assigned Classes</label>
                             <div className="max-h-40 overflow-y-auto space-y-2 p-3 border border-slate-300 rounded-lg">
                                {MOCK_CLASSES.map(c => (
                                    <label key={c.id} className="flex items-center space-x-3 cursor-pointer">
                                        <input type="checkbox" checked={formData.classes.includes(c.name)} onChange={() => handleClassToggle(c.name)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"/>
                                        <span className="text-sm text-slate-600">{c.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg">
                            <option value="Active">Active</option>
                            <option value="On-leave">On-leave</option>
                            <option value="Terminated">Terminated</option>
                        </select>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};
