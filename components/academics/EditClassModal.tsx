import React, { useState, useEffect } from 'react';
import { SchoolClass, Teacher } from '../../types';
import { XIcon, PencilIcon } from '../icons';

interface EditClassModalProps {
    schoolClass: SchoolClass;
    teachers: Teacher[];
    onClose: () => void;
    onUpdateClass: (classData: SchoolClass) => void;
}

export const EditClassModal: React.FC<EditClassModalProps> = ({ schoolClass, teachers, onClose, onUpdateClass }) => {
    const [formData, setFormData] = useState<SchoolClass>(schoolClass);

    useEffect(() => {
        setFormData(schoolClass);
    }, [schoolClass]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'formLevel' ? Number(value) : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateClass(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center">
                        <PencilIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <h2 className="text-xl font-semibold text-slate-800">Edit Class Details</h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="formLevel" className="block text-sm font-medium text-slate-700 mb-1">Form/Year Level</label>
                            <select name="formLevel" id="formLevel" value={formData.formLevel} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                               {[1, 2, 3, 4].map(level => <option key={level} value={level}>Form {level}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Class Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="stream" className="block text-sm font-medium text-slate-700 mb-1">Stream</label>
                            <select name="stream" id="stream" value={formData.stream} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                                {['A', 'B', 'C', 'D', 'East', 'West', 'North', 'South'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="teacher" className="block text-sm font-medium text-slate-700 mb-1">Class Teacher</label>
                            <select name="teacher" id="teacher" value={formData.teacher} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required>
                                {teachers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};
