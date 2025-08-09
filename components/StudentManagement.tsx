import React, { useState, useEffect } from 'react';
import { PlusIcon, SearchIcon, UploadCloudIcon } from './icons';
import { StudentRow } from './students/StudentRow';
import { AddStudentModal } from './students/AddStudentModal';
import { EditStudentModal } from './students/EditStudentModal';
import { StudentDetailModal } from './students/StudentDetailModal';
import { BulkUploadModal } from './students/BulkUploadModal';
import { Student, User, Page } from '../types';
import apiClient from '../api';

interface StudentManagementProps {
    currentUser: User;
}

const StudentManagement: React.FC<StudentManagementProps> = ({ currentUser }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
    const [studentToView, setStudentToView] = useState<Student | null>(null);

    // Load students from API
    const loadStudents = async (page = 1, search = '') => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.getStudents({
                page,
                limit: 20,
                search: search || undefined
            });
            
            // Handle the actual backend response structure
            if (response.students) {
                setStudents(response.students);
                // Since backend doesn't provide pagination, set defaults
                setTotalPages(1);
                setTotalStudents(response.students.length);
                setCurrentPage(1);
            } else {
                // Fallback if response structure is different
                setStudents(response || []);
                setTotalPages(1);
                setTotalStudents((response || []).length);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error('Failed to load students:', error);
            setError('Failed to load students. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Load students on component mount
    useEffect(() => {
        loadStudents();
    }, []);

    // Handle search with debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== '') {
                loadStudents(1, searchTerm);
            } else {
                loadStudents(1);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleAddStudent = async (newStudentData: Omit<Student, 'id' | 'status' | 'enrollmentDate' | 'avatarUrl'>) => {
        try {
            const response = await apiClient.createStudent({
                admissionNumber: newStudentData.admissionNumber,
                firstName: newStudentData.firstName,
                lastName: newStudentData.lastName,
                dateOfBirth: newStudentData.dateOfBirth,
                gender: newStudentData.gender,
                formClass: newStudentData.formClass,
                stream: newStudentData.stream,
            enrollmentDate: new Date().toISOString().split('T')[0],
                guardianName: newStudentData.guardianName,
                guardianPhone: newStudentData.guardianPhone,
                guardianEmail: newStudentData.guardianEmail,
                address: newStudentData.address,
                emergencyContact: newStudentData.emergencyContact,
                medicalConditions: newStudentData.medicalConditions
            });

            // Reload students to get the updated list
            await loadStudents(currentPage, searchTerm);
        setIsAddModalOpen(false);
        } catch (error) {
            console.error('Failed to add student:', error);
            setError('Failed to add student. Please try again.');
        }
    };
    
    const handleUpdateStudent = async (updatedStudent: Student) => {
        try {
            await apiClient.updateStudent(updatedStudent.id, {
                admissionNumber: updatedStudent.admissionNumber,
                firstName: updatedStudent.firstName,
                lastName: updatedStudent.lastName,
                dateOfBirth: updatedStudent.dateOfBirth,
                gender: updatedStudent.gender,
                formClass: updatedStudent.formClass,
                stream: updatedStudent.stream,
                status: updatedStudent.status,
                guardianName: updatedStudent.guardianName,
                guardianPhone: updatedStudent.guardianPhone,
                guardianEmail: updatedStudent.guardianEmail,
                address: updatedStudent.address,
                emergencyContact: updatedStudent.emergencyContact,
                medicalConditions: updatedStudent.medicalConditions
            });

            // Reload students to get the updated list
            await loadStudents(currentPage, searchTerm);
        setStudentToEdit(null);
        } catch (error) {
            console.error('Failed to update student:', error);
            setError('Failed to update student. Please try again.');
        }
    };

    const handleDeleteStudent = async (studentId: string) => {
        try {
            await apiClient.deleteStudent(studentId);
            // Reload students to get the updated list
            await loadStudents(currentPage, searchTerm);
        } catch (error) {
            console.error('Failed to delete student:', error);
            setError('Failed to delete student. Please try again.');
        }
    };

    const handleBulkAddStudents = async (file: File) => {
        try {
            await apiClient.bulkUploadStudents(file);
            // Reload students to get the updated list
            await loadStudents(currentPage, searchTerm);
        setIsBulkUploadModalOpen(false);
        } catch (error) {
            console.error('Failed to bulk upload students:', error);
            setError('Failed to upload students. Please check your CSV file format.');
        }
    };

    const handlePageChange = (page: number) => {
        loadStudents(page, searchTerm);
    };
    
    const canCreate = currentUser.role.permissions[Page.Students]?.create;

    if (error) {
        return (
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6">
                <div className="text-center">
                    <div className="text-red-600 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Students</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => loadStudents()}
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
                        <h2 className="text-xl font-semibold text-gray-800">Student List</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {isLoading ? 'Loading students...' : `Showing ${students.length} of ${totalStudents} students`}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center mt-4 md:mt-0">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-auto pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition"
                                aria-label="Search students"
                            />
                        </div>
                        {canCreate && (
                            <>
                                <button 
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="flex items-center justify-center px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition whitespace-nowrap">
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Add Student
                                </button>
                                <button
                                    onClick={() => setIsBulkUploadModalOpen(true)}
                                    className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition whitespace-nowrap">
                                    <UploadCloudIcon className="h-5 w-5 mr-2" />
                                    Bulk Upload
                                </button>
                            </>
                        )}
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading students...</p>
                    </div>
                ) : (
                    <>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="py-3 px-6 font-medium">Student Name</th>
                                <th scope="col" className="py-3 px-6 font-medium">Admission No.</th>
                                <th scope="col" className="py-3 px-6 font-medium">Class</th>
                                <th scope="col" className="py-3 px-6 font-medium hidden sm:table-cell">Date of Birth</th>
                                <th scope="col" className="py-3 px-6 font-medium">Status</th>
                                <th scope="col" className="py-3 px-6 font-medium"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                                    {students.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                {searchTerm ? 'No students found matching your search.' : 'No students found.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        students.map(student => (
                                <StudentRow 
                                    key={student.id} 
                                    student={student}
                                    currentUser={currentUser}
                                    onViewDetails={setStudentToView}
                                    onEdit={setStudentToEdit}
                                                onDelete={handleDeleteStudent}
                                />
                                        ))
                                    )}
                        </tbody>
                    </table>
                </div>
                        
                        {totalPages > 1 && (
                <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                                <p className="text-xs sm:text-sm">
                                    Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalStudents)} of {totalStudents} results
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

            {isAddModalOpen && <AddStudentModal onClose={() => setIsAddModalOpen(false)} onAddStudent={handleAddStudent} />}
            {isBulkUploadModalOpen && <BulkUploadModal onClose={() => setIsBulkUploadModalOpen(false)} onImport={handleBulkAddStudents} />}
            {studentToView && <StudentDetailModal student={studentToView} onClose={() => setStudentToView(null)} />}
            {studentToEdit && <EditStudentModal student={studentToEdit} onClose={() => setStudentToEdit(null)} onUpdateStudent={handleUpdateStudent} />}
        </>
    );
};

export default StudentManagement;