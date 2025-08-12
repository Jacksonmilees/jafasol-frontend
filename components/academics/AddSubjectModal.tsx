import React, { useState, useEffect } from 'react';
import { Subject, TimeSlot } from '../../types';
import { XIcon, BookOpenIcon, PlusIcon, TrashIcon } from '../icons';
import { SmartLevelSelector } from '../common/SmartLevelSelector';

interface AddSubjectModalProps {
    onClose: () => void;
    onAddSubject: (subjectData: Omit<Subject, 'id'>) => void;
}

export const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ onClose, onAddSubject }) => {
    // Basic fields
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [curriculum, setCurriculum] = useState<'8-4-4' | 'International' | 'CBC' | 'American' | 'British' | 'Indian' | 'Nigerian' | 'South African'>('8-4-4');
    const [formLevels, setFormLevels] = useState<string[]>([]);
    const [description, setDescription] = useState('');
    const [subjectCategory, setSubjectCategory] = useState<'Core' | 'Science' | 'Arts' | 'Language' | 'Mathematics' | 'Physical Education' | 'Technical' | 'Optional'>('Core');
    
    // Timetabling fields
    const [periodsPerWeek, setPeriodsPerWeek] = useState(3);
    const [periodDuration, setPeriodDuration] = useState(40);
    const [difficultyLevel, setDifficultyLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');
    const [examDuration, setExamDuration] = useState(60);
    const [requiresLab, setRequiresLab] = useState(false);
    const [canBeDoublePeriod, setCanBeDoublePeriod] = useState(false);
    const [preferredTimeSlots, setPreferredTimeSlots] = useState<TimeSlot[]>([]);
    const [requiresEquipment, setRequiresEquipment] = useState<string[]>([]);
    
    const [isLoading, setIsLoading] = useState(false);

    // Load preferred curriculum on mount
    useEffect(() => {
        const preferredCurriculum = localStorage.getItem('preferred_curriculum');
        if (preferredCurriculum) {
            setCurriculum(preferredCurriculum as any);
        }
    }, []);

    // Save curriculum preference when changed
    const handleCurriculumChange = (newCurriculum: string) => {
        setCurriculum(newCurriculum as any);
        localStorage.setItem('preferred_curriculum', newCurriculum);
    };

    const addTimeSlot = () => {
        const newSlot: TimeSlot = { day: 'Monday', period: 'Morning' };
        setPreferredTimeSlots(prev => [...prev, newSlot]);
    };

    const removeTimeSlot = (index: number) => {
        setPreferredTimeSlots(prev => prev.filter((_, i) => i !== index));
    };

    const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
        setPreferredTimeSlots(prev => prev.map((slot, i) => 
            i === index ? { ...slot, [field]: value } : slot
        ));
    };

    const addEquipment = () => {
        setRequiresEquipment(prev => [...prev, '']);
    };

    const removeEquipment = (index: number) => {
        setRequiresEquipment(prev => prev.filter((_, i) => i !== index));
    };

    const updateEquipment = (index: number, value: string) => {
        setRequiresEquipment(prev => prev.map((item, i) => 
            i === index ? value : item
        ));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim() || !code.trim()) {
            alert('Please fill in all required fields');
            return;
        }
        
        if (formLevels.length === 0) {
            alert('Please select at least one education level');
            return;
        }

        setIsLoading(true);
        
        try {
            const subjectData: Omit<Subject, 'id'> = {
                name: name.trim(),
                code: code.trim().toUpperCase(),
                curriculum,
                formLevels,
                description: description.trim(),
                status: 'Active',
                subjectCategory,
                periodsPerWeek,
                periodDuration,
                difficultyLevel,
                examDuration,
                requiresLab,
                canBeDoublePeriod,
                preferredTimeSlots,
                requiresEquipment: requiresEquipment.filter(eq => eq.trim()),
                assignedTeachers: []
            };

            await onAddSubject(subjectData);
            onClose();
        } catch (error) {
            console.error('Error creating subject:', error);
            alert('Error creating subject. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <BookOpenIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-800">Add New Subject</h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Basic Information */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                            Basic Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject Name *
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g., Mathematics, English Literature"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject Code *
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g., MATH101, ENG201"
                                    maxLength={10}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Curriculum *
                                </label>
                                <select
                                    value={curriculum}
                                    onChange={(e) => handleCurriculumChange(e.target.value)}
                                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                    required
                                >
                                    <option value="8-4-4">8-4-4 (Kenyan)</option>
                                    <option value="CBC">CBC (Competency Based)</option>
                                    <option value="International">International</option>
                                    <option value="American">American</option>
                                    <option value="British">British</option>
                                    <option value="Indian">Indian</option>
                                    <option value="Nigerian">Nigerian</option>
                                    <option value="South African">South African</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject Category *
                                </label>
                                <select
                                    value={subjectCategory}
                                    onChange={(e) => setSubjectCategory(e.target.value as any)}
                                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                    required
                                >
                                    <option value="Core">Core Subject</option>
                                    <option value="Science">Science</option>
                                    <option value="Arts">Arts</option>
                                    <option value="Language">Language</option>
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="Physical Education">Physical Education</option>
                                    <option value="Technical">Technical</option>
                                    <option value="Optional">Optional</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Form/Grade Levels *
                            </label>
                            <SmartLevelSelector
                                value={formLevels}
                                onChange={setFormLevels}
                                placeholder="Select education levels for this subject"
                                multiple={true}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Brief description of the subject..."
                            />
                        </div>
                    </div>

                    {/* Timetabling Constraints */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                            Timetabling & Scheduling
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Periods per Week *
                                </label>
                                <input
                                    type="number"
                                    value={periodsPerWeek}
                                    onChange={(e) => setPeriodsPerWeek(parseInt(e.target.value) || 1)}
                                    min="1"
                                    max="20"
                                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Period Duration (minutes) *
                                </label>
                                <input
                                    type="number"
                                    value={periodDuration}
                                    onChange={(e) => setPeriodDuration(parseInt(e.target.value) || 40)}
                                    min="30"
                                    max="120"
                                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Difficulty Level *
                                </label>
                                <select
                                    value={difficultyLevel}
                                    onChange={(e) => setDifficultyLevel(e.target.value as any)}
                                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                    required
                                >
                                    <option value="Low">Low (Easy subjects)</option>
                                    <option value="Medium">Medium (Regular subjects)</option>
                                    <option value="High">High (Challenging subjects)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Exam Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={examDuration}
                                    onChange={(e) => setExamDuration(parseInt(e.target.value) || 60)}
                                    min="30"
                                    max="180"
                                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="requiresLab"
                                        checked={requiresLab}
                                        onChange={(e) => setRequiresLab(e.target.checked)}
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
                                        checked={canBeDoublePeriod}
                                        onChange={(e) => setCanBeDoublePeriod(e.target.checked)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="canBeDoublePeriod" className="ml-2 text-sm text-gray-700">
                                        Can be scheduled as double period
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preferred Time Slots */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-md font-medium text-gray-900">Preferred Time Slots</h4>
                            <button
                                type="button"
                                onClick={addTimeSlot}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Add Time Slot
                            </button>
                        </div>

                        {preferredTimeSlots.map((slot, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <select
                                    value={slot.day}
                                    onChange={(e) => updateTimeSlot(index, 'day', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                >
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                </select>

                                <select
                                    value={slot.period}
                                    onChange={(e) => updateTimeSlot(index, 'period', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                >
                                    <option value="Morning">Morning (8:00 - 12:00)</option>
                                    <option value="Afternoon">Afternoon (12:00 - 17:00)</option>
                                    <option value="Evening">Evening (17:00 - 20:00)</option>
                                </select>

                                <button
                                    type="button"
                                    onClick={() => removeTimeSlot(index)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Required Equipment */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-md font-medium text-gray-900">Required Equipment</h4>
                            <button
                                type="button"
                                onClick={addEquipment}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Add Equipment
                            </button>
                        </div>

                        {requiresEquipment.map((equipment, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <input
                                    type="text"
                                    value={equipment}
                                    onChange={(e) => updateEquipment(index, e.target.value)}
                                    placeholder="e.g., Projector, Lab Equipment, Sports Equipment"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeEquipment(index)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex justify-end space-x-3">
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
                        disabled={isLoading || !name.trim() || !code.trim()}
                        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating...' : 'Add Subject'}
                    </button>
                </div>
            </form>
        </div>
    );
};