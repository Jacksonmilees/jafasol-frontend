import React, { useState, useEffect } from 'react';
import { Subject } from '../../types';
import { XIcon, BookOpenIcon, ClockIcon, SettingsIcon } from '../icons';

interface EditSubjectModalProps {
    subject: Subject;
    onClose: () => void;
    onUpdateSubject: (subject: Subject) => void;
}

export const EditSubjectModal: React.FC<EditSubjectModalProps> = ({ subject, onClose, onUpdateSubject }) => {
    const [formData, setFormData] = useState<Subject>(subject);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [customTimeSlot, setCustomTimeSlot] = useState('');
    const [customEquipment, setCustomEquipment] = useState('');

    const subjectCategories = [
        'Core',
        'Mathematics', 
        'Sciences',
        'Languages',
        'Arts',
        'Sports',
        'Technical',
        'Elective'
    ];

    const difficultyLevels = [
        { value: 'Low', label: 'Low', description: 'Basic concepts, suitable for any time' },
        { value: 'Medium', label: 'Medium', description: 'Moderate complexity, best in middle periods' },
        { value: 'High', label: 'High', description: 'Complex concepts, best in morning periods' }
    ];

    const predefinedTimeSlots = [
        'Morning (8:00-12:00)',
        'Mid-Morning (9:00-11:00)', 
        'Afternoon (12:00-16:00)',
        'Early Afternoon (12:00-14:00)',
        'Late Afternoon (14:00-16:00)'
    ];

    const commonEquipment = [
        'Projector',
        'Laboratory',
        'Computer Lab',
        'Audio System',
        'Sports Equipment',
        'Art Supplies',
        'Microscopes',
        'Whiteboards'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onUpdateSubject(formData);
        } catch (error) {
            console.error('Error updating subject:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof Subject, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addTimeSlot = (slot: string) => {
        if (slot && !formData.preferredTimeSlots?.includes(slot)) {
            handleInputChange('preferredTimeSlots', [
                ...(formData.preferredTimeSlots || []),
                slot
            ]);
        }
    };

    const removeTimeSlot = (index: number) => {
        const updatedSlots = [...(formData.preferredTimeSlots || [])];
        updatedSlots.splice(index, 1);
        handleInputChange('preferredTimeSlots', updatedSlots);
    };

    const addEquipment = (equipment: string) => {
        if (equipment && !formData.requiredEquipment?.includes(equipment)) {
            handleInputChange('requiredEquipment', [
                ...(formData.requiredEquipment || []),
                equipment
            ]);
        }
    };

    const removeEquipment = (index: number) => {
        const updatedEquipment = [...(formData.requiredEquipment || [])];
        updatedEquipment.splice(index, 1);
        handleInputChange('requiredEquipment', updatedEquipment);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <BookOpenIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Edit Subject</h2>
                            <p className="text-gray-600 mt-1">Update subject information and timetabling preferences</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
                        <XIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-8">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <BookOpenIcon className="h-5 w-5 mr-2" />
                                Basic Information
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                                        placeholder="e.g., Mathematics, English, Physics"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject Code
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.code || ''}
                                        onChange={(e) => handleInputChange('code', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                                        placeholder="e.g., MATH101, ENG202"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        value={formData.subjectCategory}
                                        onChange={(e) => handleInputChange('subjectCategory', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg bg-white"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {subjectCategories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => handleInputChange('status', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg bg-white"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Brief description of the subject"
                                />
                            </div>
                        </div>

                        {/* Form Levels */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Form Levels</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Form 6'].map(level => (
                                    <label key={level} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.formLevels?.includes(level) || false}
                                            onChange={(e) => {
                                                const currentLevels = formData.formLevels || [];
                                                if (e.target.checked) {
                                                    handleInputChange('formLevels', [...currentLevels, level]);
                                                } else {
                                                    handleInputChange('formLevels', currentLevels.filter(l => l !== level));
                                                }
                                            }}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700">{level}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Timetabling Constraints */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <ClockIcon className="h-5 w-5 mr-2" />
                                Timetabling Constraints
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Periods per Week *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="15"
                                        value={formData.periodsPerWeek || 4}
                                        onChange={(e) => handleInputChange('periodsPerWeek', parseInt(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Period Duration (minutes) *
                                    </label>
                                    <input
                                        type="number"
                                        min="30"
                                        max="120"
                                        value={formData.periodDuration || 40}
                                        onChange={(e) => handleInputChange('periodDuration', parseInt(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Difficulty Level *
                                    </label>
                                    <select
                                        value={formData.difficultyLevel || 'Medium'}
                                        onChange={(e) => handleInputChange('difficultyLevel', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg bg-white"
                                        required
                                    >
                                        {difficultyLevels.map(level => (
                                            <option key={level.value} value={level.value} title={level.description}>
                                                {level.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Advanced Options */}
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="requiresLab"
                                            checked={formData.requiresLab || false}
                                            onChange={(e) => handleInputChange('requiresLab', e.target.checked)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="requiresLab" className="ml-2 text-sm text-gray-700">
                                            Requires Laboratory/Special Room
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="canBeDoublePeriod"
                                            checked={formData.canBeDoublePeriod || false}
                                            onChange={(e) => handleInputChange('canBeDoublePeriod', e.target.checked)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="canBeDoublePeriod" className="ml-2 text-sm text-gray-700">
                                            Can be scheduled as double period
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Exam Duration (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            min="60"
                                            max="180"
                                            value={formData.examDuration || 90}
                                            onChange={(e) => handleInputChange('examDuration', parseInt(e.target.value))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preferred Time Slots */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <ClockIcon className="h-5 w-5 mr-2" />
                                Preferred Time Slots
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select from presets
                                        </label>
                                        <select
                                            value=""
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    addTimeSlot(e.target.value);
                                                    e.target.value = '';
                                                }
                                            }}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                        >
                                            <option value="">Choose a time slot...</option>
                                            {predefinedTimeSlots.map(slot => (
                                                <option key={slot} value={slot}>{slot}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Or add custom time slot
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="text"
                                                value={customTimeSlot}
                                                onChange={(e) => setCustomTimeSlot(e.target.value)}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="e.g., Monday mornings"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (customTimeSlot.trim()) {
                                                        addTimeSlot(customTimeSlot.trim());
                                                        setCustomTimeSlot('');
                                                    }
                                                }}
                                                className="px-4 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Current Time Slots */}
                                {formData.preferredTimeSlots && formData.preferredTimeSlots.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current preferred time slots
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.preferredTimeSlots.map((slot, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                                                >
                                                    {slot}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTimeSlot(index)}
                                                        className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-indigo-200 text-indigo-600 hover:bg-indigo-300"
                                                    >
                                                        <XIcon className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Required Equipment */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <SettingsIcon className="h-5 w-5 mr-2" />
                                Required Equipment
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select from common equipment
                                        </label>
                                        <select
                                            value=""
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    addEquipment(e.target.value);
                                                    e.target.value = '';
                                                }
                                            }}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                        >
                                            <option value="">Choose equipment...</option>
                                            {commonEquipment.map(equipment => (
                                                <option key={equipment} value={equipment}>{equipment}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Or add custom equipment
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="text"
                                                value={customEquipment}
                                                onChange={(e) => setCustomEquipment(e.target.value)}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="e.g., 3D Printer, Smart Board"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (customEquipment.trim()) {
                                                        addEquipment(customEquipment.trim());
                                                        setCustomEquipment('');
                                                    }
                                                }}
                                                className="px-4 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Current Equipment */}
                                {formData.requiredEquipment && formData.requiredEquipment.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Required equipment list
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.requiredEquipment.map((equipment, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                                                >
                                                    {equipment}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEquipment(index)}
                                                        className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-200 text-green-600 hover:bg-green-300"
                                                    >
                                                        <XIcon className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                All fields marked with * are required
                            </div>
                            
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Subject'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};