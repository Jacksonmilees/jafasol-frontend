import React, { useState, useEffect } from 'react';
import { MOCK_ACADEMIC_YEAR } from '../constants';
import { PlusIcon, BookOpenIcon, UsersIcon, AcademicsIcon, CalendarDaysIcon } from './icons';
import { SubjectRow } from './academics/SubjectRow';
import { ClassRow } from './academics/ClassRow';
import { SmartClassDisplay } from './academics/SmartClassDisplay';
import { AddClassModal } from './academics/AddClassModal';
import { EditClassModal } from './academics/EditClassModal';
import { DeleteClassModal } from './academics/DeleteClassModal';
import { AddSubjectModal } from './academics/AddSubjectModal';
import { EditSubjectModal } from './academics/EditSubjectModal';
import { DeleteSubjectModal } from './academics/DeleteSubjectModal';
import { SchoolClass, Subject, User, Page, Teacher } from '../types';
import apiClient from '../api';

interface AcademicsProps {
    currentUser?: User;
    addAuditLog?: (action: string, details: string) => void;
}

const Academics: React.FC<AcademicsProps> = ({ currentUser, addAuditLog }) => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [classes, setClasses] = useState<SchoolClass[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<'subjects' | 'classes'>('subjects');
    
    const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
    const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);

    const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
    const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
    const [classToEdit, setClassToEdit] = useState<SchoolClass | null>(null);
    const [classToDelete, setClassToDelete] = useState<SchoolClass | null>(null);

    // Permission checks
    const isAdmin = currentUser?.role?.name === 'Admin';
    const canCreate = isAdmin || currentUser?.role?.permissions?.[Page.Academics]?.create || false;
    const canEdit = isAdmin || currentUser?.role?.permissions?.[Page.Academics]?.edit || false;
    const canDelete = isAdmin || currentUser?.role?.permissions?.[Page.Academics]?.delete || false;

    // Load data from API
    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('🔄 Loading academics data...');
            const [subjectsResponse, classesResponse, teachersResponse] = await Promise.all([
                apiClient.getSubjects(),
                apiClient.getClasses(),
                apiClient.getTeachers()
            ]);
            
            console.log('📊 Academics data loaded:', {
                subjects: subjectsResponse.subjects?.length || 0,
                classes: classesResponse.classes?.length || 0,
                teachers: teachersResponse.teachers?.length || 0
            });
            
            setSubjects(subjectsResponse.subjects || []);
            setClasses(classesResponse.classes || []);
            setTeachers(teachersResponse.teachers || []);
        } catch (error) {
            console.error('❌ Failed to load academics data:', error);
            setError('Failed to load data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadData();
        
        // Listen for reload events from modals
        const handleReloadData = () => {
            loadData();
        };
        
        window.addEventListener('reloadAcademicsData', handleReloadData);
        
        return () => {
            window.removeEventListener('reloadAcademicsData', handleReloadData);
        };
    }, []);

    const handleAddSubject = async (newSubjectData: Omit<Subject, 'id'>) => {
        try {
            await apiClient.createSubject(newSubjectData);
            setIsAddSubjectModalOpen(false);
            await loadData(); // Reload data to show new subject
            addAuditLog?.('Subject Created', `Created subject: ${newSubjectData.name || 'Unknown'}`);
        } catch (error) {
            console.error('Failed to create subject:', error);
            setError('Failed to create subject. Please try again.');
        }
    };

    const handleEditSubject = (subject: Subject) => {
        setSubjectToEdit(subject);
    };

    const handleUpdateSubject = async (updatedSubjectData: Subject) => {
        try {
            await apiClient.updateSubject(updatedSubjectData.id, updatedSubjectData);
            setSubjectToEdit(null);
            await loadData(); // Reload data to show updated subject
            addAuditLog?.('Subject Updated', `Updated subject: ${updatedSubjectData.name || 'Unknown'}`);
        } catch (error) {
            console.error('Failed to update subject:', error);
            setError('Failed to update subject. Please try again.');
        }
    };

    const handleDeleteSubject = (subject: Subject) => {
        setSubjectToDelete(subject);
    };

    const confirmDeleteSubject = async () => {
        if (subjectToDelete) {
            try {
                await apiClient.deleteSubject(subjectToDelete.id);
                setSubjectToDelete(null);
                await loadData(); // Reload data to remove deleted subject
                addAuditLog?.('Subject Deleted', `Deleted subject: ${subjectToDelete.name}`);
            } catch (error) {
                console.error('Failed to delete subject:', error);
                setError('Failed to delete subject. Please try again.');
            }
        }
    };

    const handleAddClass = async (newClassData: Omit<SchoolClass, 'id' | 'students'>) => {
        try {
            await apiClient.createClass({
                name: newClassData.name,
                formLevel: newClassData.formLevel,
                stream: newClassData.stream,
                teacher: newClassData.teacher,
                capacity: 50 // Default capacity
            });
            setIsAddClassModalOpen(false);
            await loadData(); // Reload data to show new class
            addAuditLog?.('Class Created', `Created class: ${newClassData.name || 'Unknown'}`);
        } catch (error) {
            console.error('Failed to create class:', error);
            setError('Failed to create class. Please try again.');
        }
    };

    const handleUpdateClass = async (updatedClass: SchoolClass) => {
        try {
            await apiClient.updateClass(updatedClass.id, {
                name: updatedClass.name,
                formLevel: updatedClass.formLevel,
                stream: updatedClass.stream,
                teacher: updatedClass.teacher,
                capacity: updatedClass.capacity || 50
            });
            setClassToEdit(null);
            await loadData(); // Reload data to show updated class
            addAuditLog?.('Class Updated', `Updated class: ${updatedClass.name || 'Unknown'}`);
        } catch (error) {
            console.error('Failed to update class:', error);
            setError('Failed to update class. Please try again.');
        }
    };

    const handleDeleteClass = async (classId: string) => {
        try {
            await apiClient.deleteClass(classId);
            setClassToDelete(null);
            await loadData(); // Reload data to remove deleted class
            addAuditLog?.('Class Deleted', `Deleted class with ID: ${classId}`);
        } catch (error) {
            console.error('Failed to delete class:', error);
            setError('Failed to delete class. Please try again.');
        }
    };

    // Calculate statistics
    const totalSubjects = subjects.length;
    const totalClasses = classes.length;
    const activeSubjects = subjects.filter(s => s.status === 'Active').length;
    const activeClasses = classes.filter(c => c.status === 'Active').length;

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-8">
                {/* Enhanced Header */}
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-6 border border-teal-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                                <AcademicsIcon className="h-8 w-8 text-teal-600 mr-3" />
                                Academic Management
                            </h2>
                            <p className="text-gray-600 mt-2 text-lg">Manage subjects, classes, and academic structure</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-teal-200 shadow-sm mt-4 md:mt-0">
                            <p className="text-sm text-gray-500 font-medium">Current Academic Year</p>
                            <p className="text-xl font-bold text-teal-600">{MOCK_ACADEMIC_YEAR.year} - {MOCK_ACADEMIC_YEAR.currentTerm}</p>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <BookOpenIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Subjects</p>
                                <p className="text-2xl font-bold text-gray-900">{totalSubjects}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <UsersIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Classes</p>
                                <p className="text-2xl font-bold text-gray-900">{totalClasses}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <AcademicsIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Active Subjects</p>
                                <p className="text-2xl font-bold text-gray-900">{activeSubjects}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <CalendarDaysIcon className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Active Classes</p>
                                <p className="text-2xl font-bold text-gray-900">{activeClasses}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Tabs */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('subjects')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center ${
                                    activeTab === 'subjects'
                                        ? 'border-teal-500 text-teal-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <BookOpenIcon className="h-5 w-5 mr-2" />
                                Subjects ({totalSubjects})
                            </button>
                            <button
                                onClick={() => setActiveTab('classes')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center ${
                                    activeTab === 'classes'
                                        ? 'border-teal-500 text-teal-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <UsersIcon className="h-5 w-5 mr-2" />
                                Classes ({totalClasses})
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'subjects' && (
                            <div className="space-y-6">
                                {/* Subjects Header */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">Subject Management</h3>
                                        <p className="text-gray-500 mt-1">Manage all subjects offered in the curriculum</p>
                                    </div>
                                    {canCreate && (
                                        <button 
                                            onClick={() => setIsAddSubjectModalOpen(true)}
                                            className="flex items-center justify-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 shadow-sm">
                                            <PlusIcon className="h-4 w-4 mr-2" />
                                            Add New Subject
                                        </button>
                                    )}
                                </div>

                                {/* Subjects Table */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                                <tr>
                                                    <th scope="col" className="py-4 px-6 font-medium">Subject Name</th>
                                                    <th scope="col" className="py-4 px-6 font-medium">Code</th>
                                                    <th scope="col" className="py-4 px-6 font-medium">Curriculum</th>
                                                    <th scope="col" className="py-4 px-6 font-medium">Form Levels</th>
                                                    <th scope="col" className="py-4 px-6 font-medium">Status</th>
                                                    <th scope="col" className="py-4 px-6 font-medium"><span className="sr-only">Actions</span></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {isLoading ? (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-3"></div>
                                                            <p className="text-sm">Loading subjects...</p>
                                                        </td>
                                                    </tr>
                                                ) : subjects.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                            <BookOpenIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                                            <p className="text-lg font-medium text-gray-900 mb-1">No subjects found</p>
                                                            <p className="text-sm">Add your first subject to get started with academic management.</p>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    subjects.map(subject => (
                                                        <SubjectRow 
                                                            key={subject.id} 
                                                            subject={subject} 
                                                            onEdit={handleEditSubject}
                                                            onDelete={handleDeleteSubject}
                                                            currentUser={currentUser}
                                                        />
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'classes' && (
                            <div className="space-y-6">
                                {/* Classes Header */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">Class Management</h3>
                                        <p className="text-gray-500 mt-1">Manage all classes and their organization</p>
                                    </div>
                                    {canCreate && (
                                        <button 
                                            onClick={() => setIsAddClassModalOpen(true)}
                                            className="flex items-center justify-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 shadow-sm">
                                            <PlusIcon className="h-4 w-4 mr-2" />
                                            Add New Class
                                        </button>
                                    )}
                                </div>

                                {/* Classes Display */}
                                {isLoading ? (
                                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                                        <p className="text-gray-500">Loading classes...</p>
                                    </div>
                                ) : (
                                    <SmartClassDisplay
                                        classes={classes}
                                        teachers={teachers}
                                        onEditClass={setClassToEdit}
                                        onDeleteClass={setClassToDelete}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Modals */}
            {isAddSubjectModalOpen && <AddSubjectModal onClose={() => setIsAddSubjectModalOpen(false)} onAddSubject={handleAddSubject} />}
            {subjectToEdit && <EditSubjectModal subject={subjectToEdit} onClose={() => setSubjectToEdit(null)} onUpdateSubject={handleUpdateSubject} />}
            {subjectToDelete && <DeleteSubjectModal subject={subjectToDelete} onClose={() => setSubjectToDelete(null)} onDelete={confirmDeleteSubject} />}
            {isAddClassModalOpen && <AddClassModal teachers={teachers} classes={classes} onClose={() => setIsAddClassModalOpen(false)} onAddClass={handleAddClass} />}
            {classToEdit && <EditClassModal schoolClass={classToEdit} teachers={teachers} classes={classes} onClose={() => setClassToEdit(null)} onUpdateClass={handleUpdateClass} />}
            {classToDelete && <DeleteClassModal schoolClass={classToDelete} onClose={() => setClassToDelete(null)} onDelete={handleDeleteClass} />}
        </>
    );
};

export default Academics;