import React, { useState, useEffect } from 'react';
import { SchoolClass, Teacher } from '../../types';
import { XIcon, PencilIcon } from '../icons';
import { SmartLevelSelector } from '../common/SmartLevelSelector';
import { SmartStreamSelector } from '../common/SmartStreamSelector';

interface EditClassModalProps {
    schoolClass: SchoolClass;
    teachers: Teacher[];
    classes: SchoolClass[];
    onClose: () => void;
    onUpdateClass: (classData: SchoolClass) => void;
}

export const EditClassModal: React.FC<EditClassModalProps> = ({ schoolClass, teachers, classes, onClose, onUpdateClass }) => {
    const [formLevel, setFormLevel] = useState(schoolClass.formLevel || '');
    const [stream, setStream] = useState(schoolClass.stream || '');
    const [classTeacherId, setClassTeacherId] = useState(schoolClass.classTeacherId || '');
    const [capacity, setCapacity] = useState(schoolClass.capacity || 50);
    const [isLoading, setIsLoading] = useState(false);

    // Reset form when schoolClass changes
    useEffect(() => {
        setFormLevel(schoolClass.formLevel || '');
        setStream(schoolClass.stream || '');
        setClassTeacherId(schoolClass.classTeacherId || '');
        setCapacity(schoolClass.capacity || 50);
    }, [schoolClass]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formLevel.trim() || !stream.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        
        try {
            const updatedClass: SchoolClass = {
                ...schoolClass,
                formLevel: formLevel.trim(),
                stream: stream.trim(),
                name: `${formLevel.trim()} ${stream.trim()}`,
                classTeacherId: classTeacherId || null,
                capacity
            };

            await onUpdateClass(updatedClass);
            onClose();
        } catch (error) {
            console.error('Error updating class:', error);
            alert('Error updating class. Please try again.');
        } finally {
            setIsLoading(false);
        }
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

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Form Level Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Form/Grade Level *
                        </label>
                        <SmartLevelSelector
                            value={formLevel}
                            onChange={setFormLevel}
                            placeholder="Select or enter form level (e.g., Primary 1, Form 4, Grade 10)"
                        />
                    </div>

                    {/* Stream Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stream/Section *
                        </label>
                        <SmartStreamSelector
                            value={stream}
                            onChange={setStream}
                            placeholder="Select or enter stream (e.g., A, Blue, Science)"
                        />
                    </div>

                    {/* Class Name Preview */}
                    {formLevel && stream && (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                            <label className="block text-sm font-medium text-indigo-700 mb-1">
                                Class Name Preview
                            </label>
                            <p className="text-lg font-semibold text-indigo-900">
                                {formLevel} {stream}
                            </p>
                        </div>
                    )}

                    {/* Class Teacher Selection */}
                    <div>
                        <label htmlFor="classTeacher" className="block text-sm font-medium text-gray-700 mb-2">
                            Class Teacher (Optional)
                        </label>
                        <select
                            id="classTeacher"
                            value={classTeacherId}
                            onChange={(e) => setClassTeacherId(e.target.value)}
                            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        >
                            <option value="">No teacher assigned</option>
                            {teachers
                                .filter(teacher => teacher.isClassTeacher || teacher.id === classTeacherId)
                                .map(teacher => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.firstName} {teacher.lastName}
                                        {teacher.assignedClass && teacher.id !== classTeacherId ? ' (Already assigned)' : ''}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Capacity */}
                    <div>
                        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                            Class Capacity
                        </label>
                        <input
                            type="number"
                            id="capacity"
                            value={capacity}
                            onChange={(e) => setCapacity(parseInt(e.target.value) || 50)}
                            min="1"
                            max="100"
                            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        disabled={isLoading}
                        className="px-6 py-3 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isLoading || !formLevel.trim() || !stream.trim()}
                        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Updating...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};
