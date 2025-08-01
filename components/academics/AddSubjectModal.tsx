
import React, { useState } from 'react';
import { Subject } from '../../types';
import { XIcon, BookOpenIcon } from '../icons';

interface AddSubjectModalProps {
    onClose: () => void;
    onAddSubject: (subjectData: Omit<Subject, 'id'>) => void;
}

const ALL_LEVELS = [1, 2, 3, 4];

export const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ onClose, onAddSubject }) => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [curriculum, setCurriculum] = useState<'8-4-4' | 'International'>('8-4-4');
    const [formLevels, setFormLevels] = useState<number[]>([]);

    const handleLevelToggle = (level: number) => {
        setFormLevels(prev => 
            prev.includes(level)
            ? prev.filter(l => l !== level)
            : [...prev, level]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formLevels.length === 0) {
            alert('Please select at least one form level.');
            return;
        }
        onAddSubject({
            name,
            code,
            curriculum,
            formLevels: formLevels.sort((a,b) => a-b)
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center">
                        <BookOpenIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <h2 className="text-xl font-semibold text-slate-800">Add New Subject</h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
                            <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                        </div>
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-1">Subject Code</label>
                            <input type="text" name="code" id="code" value={code} onChange={(e) => setCode(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="curriculum" className="block text-sm font-medium text-slate-700 mb-1">Curriculum</label>
                        <select name="curriculum" id="curriculum" value={curriculum} onChange={(e) => setCurriculum(e.target.value as any)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                            <option value="8-4-4">8-4-4</option>
                            <option value="International">International</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Applicable Form Levels</label>
                        <div className="flex flex-wrap gap-4">
                            {ALL_LEVELS.map(level => (
                                <label key={level} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formLevels.includes(level)}
                                        onChange={() => handleLevelToggle(level)}
                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-slate-600">Form {level}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                        Save Subject
                    </button>
                </div>
            </form>
        </div>
    );
};
