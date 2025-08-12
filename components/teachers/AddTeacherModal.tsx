import React, { useState, useEffect } from 'react';
import { Teacher, Subject, SchoolClass } from '../../types';
import { XIcon, ChalkboardTeacherIcon, GraduationCapIcon, UsersIcon, ClockIcon, UserIcon, PhoneIcon, CalendarDaysIcon, ShieldCheckIcon, ShieldAlertIcon } from '../icons';
import apiClient from '../../api';

interface AddTeacherModalProps {
    onClose: () => void;
    onAddTeacher: (teacherData: any) => void;
}

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ onClose, onAddTeacher }) => {
    // Basic teacher information
    const [teacherId, setTeacherId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
    const [qualification, setQualification] = useState('');
    const [experience, setExperience] = useState('');
    const [address, setAddress] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');

    // Role selection
    const [isClassTeacher, setIsClassTeacher] = useState(false);
    const [isSubjectTeacher, setIsSubjectTeacher] = useState(true);
    
    // Class teacher assignment
    const [assignedClass, setAssignedClass] = useState('');
    const [availableClasses, setAvailableClasses] = useState<SchoolClass[]>([]);
    
    // Subject teacher assignments
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const [allClasses, setAllClasses] = useState<SchoolClass[]>([]);

    // Enhanced features
    const [isLoading, setIsLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

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
                setAvailableClasses(classesResponse.classes || []);
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setDataLoading(false);
            }
        };

        loadData();
    }, []);

    // Generate Teacher ID with enhanced logic
    const generateTeacherId = () => {
        const prefix = 'TCH';
        const year = new Date().getFullYear().toString().slice(-2);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        setTeacherId(`${prefix}${year}${random}`);
    };

    useEffect(() => {
        if (!teacherId) {
            generateTeacherId();
        }
    }, []);

    // Enhanced validation
    const validateForm = (): boolean => {
        const errors: {[key: string]: string} = {};

        if (!firstName.trim()) errors.firstName = 'First name is required';
        if (!lastName.trim()) errors.lastName = 'Last name is required';
        if (!email.trim()) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email format';
        if (!phone.trim()) errors.phone = 'Phone number is required';
        if (!dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
        if (!qualification.trim()) errors.qualification = 'Qualification is required';
        if (!experience.trim()) errors.experience = 'Experience is required';
        if (!address.trim()) errors.address = 'Address is required';

        if (!isClassTeacher && !isSubjectTeacher) {
            errors.roles = 'Please select at least one teacher role';
        }
        if (isClassTeacher && !assignedClass) {
            errors.assignedClass = 'Please select a class for class teacher role';
        }
        if (isSubjectTeacher && selectedSubjects.length === 0) {
            errors.subjects = 'Please select at least one subject to teach';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubjectToggle = (subjectId: string) => {
        setSelectedSubjects(prev => 
            prev.includes(subjectId) 
            ? prev.filter(s => s !== subjectId)
            : [...prev, subjectId]
        );
    };

    const handleClassToggle = (classId: string) => {
        setSelectedClasses(prev =>
            prev.includes(classId)
            ? prev.filter(c => c !== classId)
            : [...prev, classId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setIsLoading(true);

        try {
            const teacherData = {
                teacherId,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim(),
                dateOfBirth: new Date(dateOfBirth),
                gender,
                qualification: qualification.trim(),
                experience: parseInt(experience),
                address: address.trim(),
                specialization: specialization.trim() || undefined,
                emergencyContact: emergencyContact.trim() || undefined,
                isClassTeacher,
                assignedClass: isClassTeacher ? assignedClass : undefined,
                isSubjectTeacher,
                subjects: isSubjectTeacher ? selectedSubjects : [],
                classes: isSubjectTeacher ? selectedClasses : []
            };

            await onAddTeacher(teacherData);
        } catch (error) {
            console.error('Failed to create teacher:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate age from date of birth
    const calculateAge = (birthDate: string) => {
        if (!birthDate) return 0;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
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
                <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex items-center">
                        <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                            <ChalkboardTeacherIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800">Register New Teacher</h2>
                            <p className="text-sm text-slate-600">Complete teacher profile and role assignment</p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="Close">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="border border-slate-200 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <div className="flex items-center mb-4">
                            <UsersIcon className="h-5 w-5 text-blue-600 mr-2" />
                            <h3 className="text-lg font-semibold text-slate-800">Personal Information</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label htmlFor="teacherId" className="block text-sm font-medium text-slate-700 mb-1">
                                    Teacher ID <span className="text-red-500">*</span>
                                </label>
                                <div className="flex">
                                    <input 
                                        type="text" 
                                        id="teacherId" 
                                        value={teacherId} 
                                        onChange={(e) => setTeacherId(e.target.value)} 
                                        className={`flex-1 p-3 border rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${validationErrors.teacherId ? 'border-red-300' : 'border-slate-300'}`}
                                        required 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={generateTeacherId} 
                                        className="px-4 py-3 bg-indigo-100 border border-l-0 border-slate-300 rounded-r-lg hover:bg-indigo-200 text-sm font-medium transition-colors"
                                    >
                                        Generate
                                    </button>
                                </div>
                                {validationErrors.teacherId && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <ShieldAlertIcon className="h-3 w-3 mr-1" />
                                        {validationErrors.teacherId}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="firstName" 
                                    value={firstName} 
                                    onChange={(e) => setFirstName(e.target.value)} 
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${validationErrors.firstName ? 'border-red-300' : 'border-slate-300'}`}
                                    required 
                                />
                                {validationErrors.firstName && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <ShieldAlertIcon className="h-3 w-3 mr-1" />
                                        {validationErrors.firstName}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="lastName" 
                                    value={lastName} 
                                    onChange={(e) => setLastName(e.target.value)} 
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${validationErrors.lastName ? 'border-red-300' : 'border-slate-300'}`}
                                    required 
                                />
                                {validationErrors.lastName && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <ShieldAlertIcon className="h-3 w-3 mr-1" />
                                        {validationErrors.lastName}
                                    </p>
                                )}
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
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${validationErrors.email ? 'border-red-300' : 'border-slate-300'}`}
                                    required 
                                />
                                {validationErrors.email && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <ShieldAlertIcon className="h-3 w-3 mr-1" />
                                        {validationErrors.email}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                                    <PhoneIcon className="h-4 w-4 inline mr-1" />
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)} 
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${validationErrors.phone ? 'border-red-300' : 'border-slate-300'}`}
                                    required 
                                />
                                {validationErrors.phone && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <ShieldAlertIcon className="h-3 w-3 mr-1" />
                                        {validationErrors.phone}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-1">
                                    <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                                    Date of Birth <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="date" 
                                    id="dateOfBirth" 
                                    value={dateOfBirth} 
                                    onChange={(e) => setDateOfBirth(e.target.value)} 
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${validationErrors.dateOfBirth ? 'border-red-300' : 'border-slate-300'}`}
                                    required 
                                />
                                {dateOfBirth && (
                                    <p className="text-xs text-slate-500 mt-1">
                                        Age: {calculateAge(dateOfBirth)} years
                                    </p>
                                )}
                                {validationErrors.dateOfBirth && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <ShieldAlertIcon className="h-3 w-3 mr-1" />
                                        {validationErrors.dateOfBirth}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    id="gender" 
                                    value={gender} 
                                    onChange={(e) => setGender(e.target.value as any)} 
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="experience" className="block text-sm font-medium text-slate-700 mb-1">
                                    <ClockIcon className="h-4 w-4 inline mr-1" />
                                    Experience (years) <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="number" 
                                    id="experience" 
                                    value={experience} 
                                    onChange={(e) => setExperience(e.target.value)} 
                                    min="0" 
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${validationErrors.experience ? 'border-red-300' : 'border-slate-300'}`}
                                    required 
                                />
                                {validationErrors.experience && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <ShieldAlertIcon className="h-3 w-3 mr-1" />
                                        {validationErrors.experience}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="qualification" className="block text-sm font-medium text-slate-700 mb-1">
                                    <GraduationCapIcon className="h-4 w-4 inline mr-1" />
                                    Qualification <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="qualification" 
                                    value={qualification} 
                                    onChange={(e) => setQualification(e.target.value)} 
                                    placeholder="e.g., Bachelor's in Education" 
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${validationErrors.qualification ? 'border-red-300' : 'border-slate-300'}`}
                                    required 
                                />
                                {validationErrors.qualification && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <ShieldAlertIcon className="h-3 w-3 mr-1" />
                                        {validationErrors.qualification}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="specialization" className="block text-sm font-medium text-slate-700 mb-1">
                                    Specialization
                                </label>
                                <input 
                                    type="text" 
                                    id="specialization" 
                                    value={specialization} 
                                    onChange={(e) => setSpecialization(e.target.value)} 
                                    placeholder="e.g., Mathematics, Science" 
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <textarea 
                                    id="address" 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)} 
                                    rows={3}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${validationErrors.address ? 'border-red-300' : 'border-slate-300'}`}
                                    required 
                                />
                                {validationErrors.address && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <ShieldAlertIcon className="h-3 w-3 mr-1" />
                                        {validationErrors.address}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="emergencyContact" className="block text-sm font-medium text-slate-700 mb-1">
                                    Emergency Contact
                                </label>
                                <input 
                                    type="tel" 
                                    id="emergencyContact" 
                                    value={emergencyContact} 
                                    onChange={(e) => setEmergencyContact(e.target.value)} 
                                    placeholder="Emergency contact number" 
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Teacher Roles */}
                    <div className="border border-slate-200 rounded-xl p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                        <div className="flex items-center mb-4">
                            <GraduationCapIcon className="h-5 w-5 text-green-600 mr-2" />
                            <h3 className="text-lg font-semibold text-slate-800">Role Assignment</h3>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Class Teacher Role */}
                            <div className="border border-slate-200 rounded-lg p-4 bg-white">
                                <div className="flex items-start space-x-3">
                                    <input 
                                        type="checkbox" 
                                        id="isClassTeacher" 
                                        checked={isClassTeacher} 
                                        onChange={(e) => setIsClassTeacher(e.target.checked)}
                                        className="mt-1 h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="flex-1">
                                        <label htmlFor="isClassTeacher" className="block text-sm font-semibold text-slate-700 mb-1">
                                            Class Teacher <span className="text-xs text-slate-500 font-normal">(1:1 - Responsible for one specific class)</span>
                                        </label>
                                        <p className="text-xs text-slate-600 mb-3">As a class teacher, you'll be responsible for this class's overall welfare, administration, and parent communication.</p>
                                        
                                        {isClassTeacher && (
                                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    Select Class to Manage <span className="text-red-500">*</span>
                                                </label>
                                                <select 
                                                    value={assignedClass} 
                                                    onChange={(e) => setAssignedClass(e.target.value)}
                                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${validationErrors.assignedClass ? 'border-red-300' : 'border-slate-300'}`}
                                                    required={isClassTeacher}
                                                >
                                                    <option value="">Select class to be in charge of...</option>
                                                    {availableClasses
                                                        .filter(cls => !cls.teacher) // Only show classes without class teachers
                                                        .map(cls => (
                                                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                                                        ))
                                                    }
                                                </select>
                                                {validationErrors.assignedClass && (
                                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                                        <ShieldAlertIcon className="h-3 w-3 mr-1" />
                                                        {validationErrors.assignedClass}
                                                    </p>
                                                )}
                                                <div className="mt-2 flex items-center text-xs text-blue-700">
                                                    <ShieldCheckIcon className="h-3 w-3 mr-1" />
                                                    <span>You'll have full administrative access for this class</span>
                                                </div>
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
                                        checked={isSubjectTeacher} 
                                        onChange={(e) => setIsSubjectTeacher(e.target.checked)}
                                        className="mt-1 h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="flex-1">
                                        <label htmlFor="isSubjectTeacher" className="block text-sm font-semibold text-slate-700 mb-1">
                                            Subject Teacher <span className="text-xs text-slate-500 font-normal">(Many:Many - Teaches specific subjects to multiple classes)</span>
                                        </label>
                                        <p className="text-xs text-slate-600 mb-3">As a subject teacher, you'll teach specific subjects to multiple classes and manage subject-related activities.</p>
                                        
                                        {isSubjectTeacher && (
                                            <div className="mt-3 space-y-4">
                                                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        Subjects to Teach <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="max-h-40 overflow-y-auto space-y-2 p-3 border border-slate-300 rounded-lg bg-white">
                                                        {allSubjects.length === 0 ? (
                                                            <p className="text-sm text-slate-500">No subjects available. Create subjects first.</p>
                                                        ) : (
                                                            allSubjects.map(subject => (
                                                                <label key={subject.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-slate-50">
                                                                    <input 
                                                                        type="checkbox" 
                                                                        checked={selectedSubjects.includes(subject.id)} 
                                                                        onChange={() => handleSubjectToggle(subject.id)}
                                                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                                    />
                                                                    <div>
                                                                        <span className="text-sm font-medium text-slate-700">{subject.name}</span>
                                                                        <span className="text-xs text-slate-500 ml-2">({subject.code})</span>
                                                                    </div>
                                                                </label>
                                                            ))
                                                        )}
                                                    </div>
                                                    {validationErrors.subjects && (
                                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                                            <ShieldAlertIcon className="h-3 w-3 mr-1" />
                                                            {validationErrors.subjects}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        Classes to Teach
                                                    </label>
                                                    <div className="max-h-40 overflow-y-auto space-y-2 p-3 border border-slate-300 rounded-lg bg-white">
                                                        {allClasses.length === 0 ? (
                                                            <p className="text-sm text-slate-500">No classes available. Create classes first.</p>
                                                        ) : (
                                                            allClasses.map(cls => (
                                                                <label key={cls.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-slate-50">
                                                                    <input 
                                                                        type="checkbox" 
                                                                        checked={selectedClasses.includes(cls.id)} 
                                                                        onChange={() => handleClassToggle(cls.id)}
                                                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                                    />
                                                                    <span className="text-sm text-slate-700">{cls.name}</span>
                                                                </label>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {!isClassTeacher && !isSubjectTeacher && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                                <div className="flex items-center">
                                    <ShieldAlertIcon className="h-5 w-5 text-amber-600 mr-2" />
                                    <p className="text-sm text-amber-800 font-medium">Please select at least one teacher role.</p>
                                </div>
                            </div>
                        )}
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
                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                        {isLoading ? 'Creating Teacher...' : 'Create Teacher Account'}
                    </button>
                </div>
            </form>
        </div>
    );
};