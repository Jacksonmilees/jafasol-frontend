
import React, { useState, useEffect } from 'react';
import { PlusIcon, SearchIcon, ChalkboardTeacherIcon } from './icons';
import { TeacherRow } from './teachers/TeacherRow';
import { AddTeacherModal } from './teachers/AddTeacherModal';
import { EditTeacherModal } from './teachers/EditTeacherModal';
import { Teacher, User, Page } from '../types';
import apiClient from '../api';

interface TeacherManagementProps {
    currentUser: User;
}

const TeacherManagement: React.FC<TeacherManagementProps> = ({ currentUser }) => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTeachers, setTotalTeachers] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);

    // Load teachers from API
    const loadTeachers = async (page = 1, search = '') => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.getTeachers({
                page,
                limit: 20,
                search: search || undefined
            });
            
            // Handle the actual backend response structure
            if (response.teachers) {
                setTeachers(response.teachers);
                // Since backend doesn't provide pagination, set defaults
                setTotalPages(1);
                setTotalTeachers(response.teachers.length);
                setCurrentPage(1);
            } else {
                // Fallback if response structure is different
                setTeachers(response || []);
                setTotalPages(1);
                setTotalTeachers((response || []).length);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error('Failed to load teachers:', error);
            setError('Failed to load teachers. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Load teachers on component mount
    useEffect(() => {
        loadTeachers();
    }, []);

    // Handle search with debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== '') {
                loadTeachers(1, searchTerm);
            } else {
                loadTeachers(1);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleAddTeacher = async (newTeacherData: Omit<Teacher, 'id' | 'status' | 'avatarUrl'>) => {
        try {
            await apiClient.createTeacher({
                name: newTeacherData.name,
                email: newTeacherData.email,
                subjects: newTeacherData.subjects,
                classes: newTeacherData.classes,
                phone: newTeacherData.phone,
                address: newTeacherData.address,
                qualification: newTeacherData.qualification,
                employmentDate: newTeacherData.employmentDate
            });

            // Reload teachers to get the updated list
            await loadTeachers(currentPage, searchTerm);
        setIsAddModalOpen(false);
        } catch (error) {
            console.error('Failed to add teacher:', error);
            setError('Failed to add teacher. Please try again.');
        }
    };
    
    const handleUpdateTeacher = async (updatedTeacher: Teacher) => {
        try {
            await apiClient.updateTeacher(updatedTeacher.id, {
                name: updatedTeacher.name,
                email: updatedTeacher.email,
                subjects: updatedTeacher.subjects,
                classes: updatedTeacher.classes,
                status: updatedTeacher.status,
                phone: updatedTeacher.phone,
                address: updatedTeacher.address,
                qualification: updatedTeacher.qualification,
                employmentDate: updatedTeacher.employmentDate
            });

            // Reload teachers to get the updated list
            await loadTeachers(currentPage, searchTerm);
        setTeacherToEdit(null);
        } catch (error) {
            console.error('Failed to update teacher:', error);
            setError('Failed to update teacher. Please try again.');
        }
    };

    const handleDeleteTeacher = async (teacherId: string) => {
        try {
            await apiClient.deleteTeacher(teacherId);
            // Reload teachers to get the updated list
            await loadTeachers(currentPage, searchTerm);
        } catch (error) {
            console.error('Failed to delete teacher:', error);
            setError('Failed to delete teacher. Please try again.');
        }
    };

    const handlePageChange = (page: number) => {
        loadTeachers(page, searchTerm);
    };

    const canCreate = currentUser.role.permissions[Page.Teachers]?.create;

    if (error) {
        return (
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6">
                <div className="text-center">
                    <div className="text-red-600 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Teachers</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => loadTeachers()}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
                <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Teacher Management</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {isLoading ? 'Loading teachers...' : `Showing ${teachers.length} of ${totalTeachers} teachers`}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search teachers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                                aria-label="Search teachers"
                            />
                        </div>
                        {canCreate && (
                            <button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition whitespace-nowrap">
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Register Teacher
                            </button>
                        )}
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading teachers...</p>
                    </div>
                ) : (
                    <>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="py-3 px-6 font-medium">Teacher</th>
                                <th scope="col" className="py-3 px-6 font-medium">Subjects Taught</th>
                                <th scope="col" className="py-3 px-6 font-medium">Classes Assigned</th>
                                <th scope="col" className="py-3 px-6 font-medium">Status</th>
                                <th scope="col" className="py-3 px-6 font-medium"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {teachers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                {searchTerm ? 'No teachers found matching your search.' : 'No teachers found.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        teachers.map(teacher => (
                                <TeacherRow 
                                    key={teacher.id} 
                                    teacher={teacher}
                                    onEdit={setTeacherToEdit}
                                                onDelete={handleDeleteTeacher}
                                    currentUser={currentUser}
                                />
                                        ))
                                    )}
                        </tbody>
                    </table>
                </div>
                        
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                                <p className="text-xs sm:text-sm">
                                    Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalTeachers)} of {totalTeachers} results
                                </p>
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                    <button 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1 text-xs sm:text-sm">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button 
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                    </div>
                </div>
                        )}
                    </>
                )}
            </div>

            {isAddModalOpen && <AddTeacherModal onClose={() => setIsAddModalOpen(false)} onAddTeacher={handleAddTeacher} />}
            {teacherToEdit && <EditTeacherModal teacher={teacherToEdit} onClose={() => setTeacherToEdit(null)} onUpdateTeacher={handleUpdateTeacher} />}
        </>
    );
};

export default TeacherManagement;

