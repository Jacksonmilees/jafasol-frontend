
import React, { useState, useEffect } from 'react';
import { Teacher, Subject, SchoolClass } from '../../types';
import { XIcon, PencilIcon, UserIcon, AcademicsIcon, PhoneIcon, CalendarDaysIcon, ShieldCheckIcon, ClockIcon, GraduationCapIcon, UsersIcon, BookOpenIcon } from '../icons';
import apiClient from '../../api';

interface EditTeacherModalProps {
    teacher: Teacher;
    onClose: () => void;
    onUpdateTeacher: (teacher: Teacher) => void;
}

export const EditTeacherModal: React.FC<EditTeacherModalProps> = ({ teacher, onClose, onUpdateTeacher }) => {
    const [formData, setFormData] = useState({
        firstName: teacher.firstName || '',
        lastName: teacher.lastName || '',
        email: teacher.email || '',
        phone: teacher.phone || '',
        dateOfBirth: teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toISOString().split('T')[0] : '',
        gender: teacher.gender || 'Male',
        qualification: teacher.qualification || '',
        experience: teacher.experience?.toString() || '',
        address: teacher.address || '',
        specialization: (teacher as any).specialization || '',
        emergencyContact: (teacher as any).emergencyContact || '',
        isClassTeacher: teacher.isClassTeacher || false,
        assignedClass: teacher.assignedClass ? (typeof teacher.assignedClass === 'string' ? teacher.assignedClass : teacher.assignedClass.id) : '',
        isSubjectTeacher: teacher.isSubjectTeacher || false,
        selectedSubjects: teacher.subjects?.map(s => typeof s === 'string' ? s : s.id) || [],
        selectedClasses: teacher.classes?.map(c => typeof c === 'string' ? c : c.id) || [],
        status: teacher.status || 'Active'
    });

    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const [allClasses, setAllClasses] = useState<SchoolClass[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    // Load required data
    useEffect(() => {
        const loadData = async () => {
            try {
                const [subjectsResponse, classesResponse] = await Promise.all([
                    apiClient.getSubjects(),
                    apiClient.getClasses()
                ]);
                
                setAllSubjects(subjectsResponse.subjects || []);
                setAllClasses(classesResponse.classes || []);
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setDataLoading(false);
            }
        };

        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubjectToggle = (subjectId: string) => {
        setFormData(prev => ({
            ...prev,
            selectedSubjects: prev.selectedSubjects.includes(subjectId)
                ? prev.selectedSubjects.filter(s => s !== subjectId)
                : [...prev.selectedSubjects, subjectId]
        }));
    };

    const handleClassToggle = (classId: string) => {
        setFormData(prev => ({
            ...prev,
            selectedClasses: prev.selectedClasses.includes(classId)
                ? prev.selectedClasses.filter(c => c !== classId)
                : [...prev.selectedClasses, classId]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const updatedTeacher = {
                ...teacher,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
                gender: formData.gender as 'Male' | 'Female' | 'Other',
                qualification: formData.qualification,
                experience: parseInt(formData.experience) || 0,
                address: formData.address,
                specialization: formData.specialization,
                emergencyContact: formData.emergencyContact,
                isClassTeacher: formData.isClassTeacher,
                assignedClass: formData.isClassTeacher ? (formData.assignedClass ? allClasses.find(c => c.id === formData.assignedClass) || null : null) : undefined,
                isSubjectTeacher: formData.isSubjectTeacher,
                subjects: formData.isSubjectTeacher ? formData.selectedSubjects.map(id => allSubjects.find(s => s.id === id)).filter(Boolean) as Subject[] : [],
                classes: formData.isSubjectTeacher ? formData.selectedClasses.map(id => allClasses.find(c => c.id === id)).filter(Boolean) as SchoolClass[] : [],
                status: formData.status as 'Active' | 'Inactive' | 'On-leave' | 'Retired'
            };

            await onUpdateTeacher(updatedTeacher);
        } catch (error) {
            console.error('Failed to update teacher:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (dataLoading) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading teacher data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                {/* Enhanced Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <PencilIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800">Edit Teacher Profile</h2>
                            <p className="text-sm text-slate-600">Update {teacher.firstName} {teacher.lastName}'s information</p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="Close">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Personal Information */}
                    <div className="border border-slate-200 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <div className="flex items-center mb-4">
                            <UserIcon className="h-5 w-5 text-blue-600 mr-2" />
                            <h3 className="text-lg font-semibold text-slate-800">Personal Information</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="firstName" 
                                    name="firstName"
                                    value={formData.firstName} 
                                    onChange={handleChange} 
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required 
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="lastName" 
                                    name="lastName"
                                    value={formData.lastName} 
                                    onChange={handleChange} 
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required 
                                />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    id="gender" 
                                    name="gender"
                                    value={formData.gender} 
                                    onChange={handleChange} 
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email"
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required 
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                                    <PhoneIcon className="h-4 w-4 inline mr-1" />
                                    Phone Number
                                </label>
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    name="phone"
                                    value={formData.phone} 
                                    onChange={handleChange} 
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-1">
                                    <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                                    Date of Birth
                                </label>
                                <input 
                                    type="date" 
                                    id="dateOfBirth" 
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth} 
                                    onChange={handleChange} 
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label htmlFor="emergencyContact" className="block text-sm font-medium text-slate-700 mb-1">
                                    Emergency Contact
                                </label>
                                <input 
                                    type="tel" 
                                    id="emergencyContact" 
                                    name="emergencyContact"
                                    value={formData.emergencyContact} 
                                    onChange={handleChange} 
                                    placeholder="Emergency contact number" 
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="border border-slate-200 rounded-xl p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                        <div className="flex items-center mb-4">
                            <AcademicsIcon className="h-5 w-5 text-green-600 mr-2" />
                            <h3 className="text-lg font-semibold text-slate-800">Professional Information</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label htmlFor="qualification" className="block text-sm font-medium text-slate-700 mb-1">
                                    <GraduationCapIcon className="h-4 w-4 inline mr-1" />
                                    Qualification <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="qualification" 
                                    name="qualification"
                                    value={formData.qualification} 
                                    onChange={handleChange} 
                                    placeholder="e.g., Bachelor's in Education" 
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    required 
                                />
                            </div>
                            <div>
                                <label htmlFor="experience" className="block text-sm font-medium text-slate-700 mb-1">
                                    <ClockIcon className="h-4 w-4 inline mr-1" />
                                    Experience (years) <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="number" 
                                    id="experience" 
                                    name="experience"
                                    value={formData.experience} 
                                    onChange={handleChange} 
                                    min="0" 
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    required 
                                />
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
                                    <ShieldCheckIcon className="h-4 w-4 inline mr-1" />
                                    Status
                                </label>
                                <select 
                                    id="status" 
                                    name="status"
                                    value={formData.status} 
                                    onChange={handleChange} 
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="On-leave">On-leave</option>
                                    <option value="Retired">Retired</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="specialization" className="block text-sm font-medium text-slate-700 mb-1">
                                    Specialization
                                </label>
                                <input 
                                    type="text" 
                                    id="specialization" 
                                    name="specialization"
                                    value={formData.specialization} 
                                    onChange={handleChange} 
                                    placeholder="e.g., Mathematics, Science" 
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
                                    Address
                                </label>
                                <textarea 
                                    id="address" 
                                    name="address"
                                    value={formData.address} 
                                    onChange={handleChange} 
                                    rows={3}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Role Assignment */}
                    <div className="border border-slate-200 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                        <div className="flex items-center mb-4">
                            <UsersIcon className="h-5 w-5 text-purple-600 mr-2" />
                            <h3 className="text-lg font-semibold text-slate-800">Role Assignment</h3>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Class Teacher Role */}
                            <div className="border border-slate-200 rounded-lg p-4 bg-white">
                                <div className="flex items-start space-x-3">
                                    <input 
                                        type="checkbox" 
                                        id="isClassTeacher" 
                                        name="isClassTeacher"
                                        checked={formData.isClassTeacher} 
                                        onChange={handleChange}
                                        className="mt-1 h-5 w-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <div className="flex-1">
                                        <label htmlFor="isClassTeacher" className="block text-sm font-semibold text-slate-700 mb-1">
                                            Class Teacher <span className="text-xs text-slate-500 font-normal">(1:1 - Responsible for one specific class)</span>
                                        </label>
                                        
                                        {formData.isClassTeacher && (
                                            <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    Select Class to Manage
                                                </label>
                                                <select 
                                                    name="assignedClass"
                                                    value={formData.assignedClass} 
                                                    onChange={handleChange}
                                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                                >
                                                    <option value="">Select class to be in charge of...</option>
                                                    {allClasses
                                                        .filter(cls => !cls.teacher) // Only show classes without class teachers
                                                        .map(cls => (
                                                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Subject Teacher Role */}
                            <div className="border border-slate-200 rounded-lg p-4 bg-white">
                                <div className="flex items-start space-x-3">
                                    <input 
                                        type="checkbox" 
                                        id="isSubjectTeacher" 
                                        name="isSubjectTeacher"
                                        checked={formData.isSubjectTeacher} 
                                        onChange={handleChange}
                                        className="mt-1 h-5 w-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <div className="flex-1">
                                        <label htmlFor="isSubjectTeacher" className="block text-sm font-semibold text-slate-700 mb-1">
                                            Subject Teacher <span className="text-xs text-slate-500 font-normal">(Many:Many - Teaches specific subjects to multiple classes)</span>
                                        </label>
                                        
                                        {formData.isSubjectTeacher && (
                                            <div className="mt-3 space-y-4">
                                                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        <BookOpenIcon className="h-4 w-4 inline mr-1" />
                                                        Subjects to Teach
                                                    </label>
                                                    <div className="max-h-40 overflow-y-auto space-y-2 p-3 border border-slate-300 rounded-lg bg-white">
                                                        {allSubjects.map(subject => (
                                                            <label key={subject.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-slate-50">
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={formData.selectedSubjects.includes(subject.id)} 
                                                                    onChange={() => handleSubjectToggle(subject.id)}
                                                                    className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                                                />
                                                                <div>
                                                                    <span className="text-sm font-medium text-slate-700">{subject.name}</span>
                                                                    <span className="text-xs text-slate-500 ml-2">({subject.code})</span>
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                                
                                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        <UsersIcon className="h-4 w-4 inline mr-1" />
                                                        Classes to Teach
                                                    </label>
                                                    <div className="max-h-40 overflow-y-auto space-y-2 p-3 border border-slate-300 rounded-lg bg-white">
                                                        {allClasses.map(cls => (
                                                            <label key={cls.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-slate-50">
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={formData.selectedClasses.includes(cls.id)} 
                                                                    onChange={() => handleClassToggle(cls.id)}
                                                                    className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                                                />
                                                                <span className="text-sm text-slate-700">{cls.name}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-between items-center">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                        {isLoading ? 'Updating...' : 'Update Teacher Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
};

