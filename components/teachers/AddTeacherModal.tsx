
import React, { useState } from 'react';
import { Teacher } from '../../types';
import { MOCK_SUBJECTS, MOCK_CLASSES } from '../../constants';
import { XIcon, ChalkboardTeacherIcon } from '../icons';

interface AddTeacherModalProps {
    onClose: () => void;
    onAddTeacher: (teacherData: Omit<Teacher, 'id' | 'status' | 'avatarUrl'>) => void;
}

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ onClose, onAddTeacher }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

    const handleSubjectToggle = (subjectName: string) => {
        setSelectedSubjects(prev => 
            prev.includes(subjectName) 
            ? prev.filter(s => s !== subjectName)
            : [...prev, subjectName]
        );
    };

    const handleClassToggle = (className: string) => {
        setSelectedClasses(prev =>
            prev.includes(className)
            ? prev.filter(c => c !== className)
            : [...prev, className]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddTeacher({ name, email, subjects: selectedSubjects, classes: selectedClasses });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center">
                        <ChalkboardTeacherIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <h2 className="text-xl font-semibold text-slate-800">Register New Teacher</h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Assign Subjects</label>
                            <div className="max-h-40 overflow-y-auto space-y-2 p-3 border border-slate-300 rounded-lg">
                                {MOCK_SUBJECTS.map(subject => (
                                    <label key={subject.id} className="flex items-center space-x-3 cursor-pointer">
                                        <input type="checkbox" checked={selectedSubjects.includes(subject.name)} onChange={() => handleSubjectToggle(subject.name)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"/>
                                        <span className="text-sm text-slate-600">{subject.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Assign Classes</label>
                             <div className="max-h-40 overflow-y-auto space-y-2 p-3 border border-slate-300 rounded-lg">
                                {MOCK_CLASSES.map(c => (
                                    <label key={c.id} className="flex items-center space-x-3 cursor-pointer">
                                        <input type="checkbox" checked={selectedClasses.includes(c.name)} onChange={() => handleClassToggle(c.name)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"/>
                                        <span className="text-sm text-slate-600">{c.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                        Save Teacher
                    </button>
                </div>
            </form>
        </div>
    );
};
