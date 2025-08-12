import React, { useState } from 'react';
import { SchoolClass, Teacher } from '../../types';
import { XIcon, AcademicsIcon, PlusIcon } from '../icons';
import { SmartLevelSelector } from '../common/SmartLevelSelector';
import { SmartStreamSelector } from '../common/SmartStreamSelector';
import { MultiStreamCreator } from '../common/MultiStreamCreator';
import apiClient from '../../api';

interface AddClassModalProps {
    teachers: Teacher[];
    classes: SchoolClass[]; // To extract existing forms and streams
    onClose: () => void;
    onAddClass: (classData: Omit<SchoolClass, 'id' | 'students'>) => void;
}

export const AddClassModal: React.FC<AddClassModalProps> = ({ teachers, classes, onClose, onAddClass }) => {
    const [formLevel, setFormLevel] = useState<string[]>([]);
    const [stream, setStream] = useState('');
    const [teacher, setTeacher] = useState('');
    const [showMultiStreamCreator, setShowMultiStreamCreator] = useState(false);

    // Extract existing streams from classes
    const existingStreams = [...new Set(classes.map(c => c.stream))].sort();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formLevel.length === 0) {
            alert('Please select a form/grade level for this class.');
            return;
        }
        
        if (!stream.trim()) {
            alert('Please select or enter a stream/section for this class.');
            return;
        }
        
        // Use the first (and only) selected level for classes
        const selectedLevel = formLevel[0];
        
        onAddClass({ 
            name: `${selectedLevel} ${stream}`, 
            formLevel: selectedLevel, 
            stream, 
            teacher: teacher || null, // Pass null if no teacher selected
            capacity: 50 // Default capacity
        });
    };

    const handleMultiStreamCreate = async (streams: string[]) => {
        if (formLevel.length === 0) {
            alert('Please select a form/grade level first.');
            return;
        }

        const selectedLevel = formLevel[0];
        
        try {
            // Create multiple classes by calling the API directly
            for (const streamName of streams) {
                await apiClient.createClass({
                    name: `${selectedLevel} ${streamName}`, 
                    formLevel: selectedLevel, 
                    stream: streamName, 
                    teacher: null, // No teacher assigned initially
                    capacity: 50 // Default capacity
                });
            }
            
            setShowMultiStreamCreator(false);
            onClose(); // Close the modal after creating multiple classes
            
            // Trigger parent to reload data without page refresh
            if (window.location.pathname.includes('/academics')) {
                // Dispatch custom event to reload academics data
                window.dispatchEvent(new CustomEvent('reloadAcademicsData'));
            }
        } catch (error) {
            console.error('Failed to create multiple classes:', error);
            alert('Failed to create some classes. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center">
                        <AcademicsIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <h2 className="text-xl font-semibold text-slate-800">Add New Class</h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Smart Level Selector */}
                    <SmartLevelSelector
                        value={formLevel}
                        onChange={setFormLevel}
                        label="Class Level"
                        multiple={false}
                        placeholder="Select the grade/form level for this class..."
                    />

                    {/* Smart Stream Selector */}
                    <SmartStreamSelector
                        value={stream}
                        onChange={setStream}
                        existingStreams={existingStreams}
                        label="Stream/Section"
                        placeholder="Select or enter stream (A, B, Science, etc.)..."
                    />

                                                {/* Class Teacher Selection */}
                            <div>
                                <label htmlFor="teacher" className="block text-sm font-medium text-slate-700 mb-2">Class Teacher (Optional)</label>
                                <select 
                                    id="teacher" 
                                    value={teacher} 
                                    onChange={(e) => setTeacher(e.target.value)} 
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                >
                                    <option value="">No class teacher assigned yet</option>
                                    {teachers
                                        .filter(t => t.isClassTeacher !== false && !t.assignedClass) // Available for class teacher role
                                        .map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))
                                    }
                                </select>
                                <p className="text-xs text-slate-500 mt-1">Only teachers available as class teachers are shown. You can assign/change this later.</p>
                            </div>

                    {/* Multiple Classes Option */}
                    {formLevel.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base text-blue-800 font-medium">
                                        Create Multiple Classes for {formLevel[0]}
                                    </p>
                                    <p className="text-sm text-blue-600 mt-1">
                                        Quickly create multiple streams (A, B, Science, etc.) at once
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowMultiStreamCreator(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <PlusIcon className="h-4 w-4" />
                                    Create Multiple
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Single Class Preview */}
                    {formLevel.length > 0 && stream && (
                        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                            <p className="text-base text-emerald-800 font-medium">
                                <strong>Single Class Preview:</strong> {formLevel[0]} {stream}
                            </p>
                            <p className="text-sm text-emerald-600 mt-1">
                                This will create one class
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                        Save Class
                    </button>
                </div>
            </form>

            {/* Multi-Stream Creator Modal */}
            {showMultiStreamCreator && (
                <MultiStreamCreator
                    formLevel={formLevel[0] || ''}
                    onStreamsCreate={handleMultiStreamCreate}
                    onClose={() => setShowMultiStreamCreator(false)}
                    existingStreams={classes.map(c => c.name)}
                />
            )}
        </div>
    );
};