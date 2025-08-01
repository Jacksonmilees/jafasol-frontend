import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { XIcon, PencilIcon } from '../icons';

interface EditStudentModalProps {
    student: Student;
    onClose: () => void;
    onUpdateStudent: (student: Student) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({ student, onClose, onUpdateStudent }) => {
    const [formData, setFormData] = useState<Student>(student);
    
    useEffect(() => {
        setFormData(student);
    }, [student]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateStudent(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <PencilIcon className="h-6 w-6 text-teal-600 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-800">Edit Student Details</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" required />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" required />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="admissionNumber" className="block text-sm font-medium text-gray-700 mb-1">Admission Number</label>
                            <input type="text" name="admissionNumber" id="admissionNumber" value={formData.admissionNumber} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input type="date" name="dateOfBirth" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" required />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition">
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="formClass" className="block text-sm font-medium text-gray-700 mb-1">Form / Class</label>
                                <select name="formClass" id="formClass" value={formData.formClass} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition">
                                    <option>Form 1</option>
                                    <option>Form 2</option>
                                    <option>Form 3</option>
                                    <option>Form 4</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="stream" className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                                <select name="stream" id="stream" value={formData.stream} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition">
                                    <option>A</option>
                                    <option>B</option>
                                    <option>C</option>
                                    <option>D</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-100 transition">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};