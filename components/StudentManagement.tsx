import React, { useState, useEffect } from 'react';
import { 
    UsersIcon, 
    PlusIcon, 
    EyeIcon,
    PencilIcon,
    TrashIcon,
    DocumentStoreIcon,
    AcademicsIcon,
    PhoneIcon,
    UserIcon
} from './icons';
import { User, Page, Student, SchoolClass } from '../types';
import apiClient from '../api';
import { AddStudentModal } from './students/AddStudentModal';
import { EditStudentModal } from './students/EditStudentModal';
import { StudentRow } from './students/StudentRow';

interface StudentManagementProps {
    currentUser?: User;
    addAuditLog?: (action: string, details: string) => void;
}

const StudentManagement: React.FC<StudentManagementProps> = ({ currentUser, addAuditLog }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<SchoolClass[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
    const [credentialsToShow, setCredentialsToShow] = useState<any>(null);

    // Permission checks
    const isAdmin = currentUser?.role?.name === 'Admin';
    const canCreate = isAdmin || currentUser?.role?.permissions?.[Page.Students]?.create || false;
    const canEdit = isAdmin || currentUser?.role?.permissions?.[Page.Students]?.edit || false;
    const canDelete = isAdmin || currentUser?.role?.permissions?.[Page.Students]?.delete || false;

    // Load students from API
    const loadStudents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params: any = {
                page: currentPage,
                limit: 20,
            };
            
            if (searchTerm) params.search = searchTerm;
            if (selectedClass) params.classId = selectedClass;
            if (selectedStatus) params.status = selectedStatus;

            const response = await apiClient.getStudents(params);
            setStudents(response.students);
            setTotalPages(response.totalPages);
            setTotalStudents(response.total);
        } catch (error) {
            console.error('Failed to load students:', error);
            setError('Failed to load students. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Load classes for filtering
    const loadClasses = async () => {
        try {
            const response = await apiClient.getClasses({ limit: 100 });
            setClasses(response.classes);
        } catch (error) {
            console.error('Failed to load classes:', error);
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadStudents();
        loadClasses();
    }, [currentPage, searchTerm, selectedClass, selectedStatus]);

    // Handle search with debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            loadStudents();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, selectedClass, selectedStatus]);

    // Handle adding a new student
    const handleAddStudent = async (studentData: any) => {
        try {
            const response = await apiClient.createStudent(studentData);
            
            // Show credentials if provided
            if (response.loginCredentials) {
                setCredentialsToShow(response.loginCredentials);
            }
            
            setShowAddModal(false);
            loadStudents();
            addAuditLog?.('Student Created', `Created student: ${studentData.firstName} ${studentData.lastName}`);
        } catch (error) {
            console.error('Failed to create student:', error);
            throw error;
        }
    };

    // Handle updating a student
    const handleUpdateStudent = async (id: string, studentData: any) => {
        try {
            await apiClient.updateStudent(id, studentData);
            setEditingStudent(null);
            loadStudents();
            addAuditLog?.('Student Updated', `Updated student: ${studentData.firstName} ${studentData.lastName}`);
        } catch (error) {
            console.error('Failed to update student:', error);
            throw error;
        }
    };

    // Handle deleting a student
    const handleDeleteStudent = async (id: string) => {
        try {
            await apiClient.deleteStudent(id);
            setDeletingStudent(null);
            loadStudents();
            addAuditLog?.('Student Deleted', `Deleted student: ${deletingStudent?.firstName} ${deletingStudent?.lastName}`);
        } catch (error) {
            console.error('Failed to delete student:', error);
            throw error;
        }
    };

    // Calculate statistics
    const activeStudents = students.filter(s => s.status === 'Active').length;
    const inactiveStudents = students.filter(s => s.status === 'Inactive').length;
    const graduatedStudents = students.filter(s => s.status === 'Graduated').length;

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                            <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
                            Student Management
                        </h2>
                        <p className="text-gray-600 mt-2 text-lg">Register, manage, and track student information with auto-generated admission numbers</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm mt-4 md:mt-0">
                        <p className="text-sm text-gray-500 font-medium">Total Students</p>
                        <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <UserIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Active Students</p>
                            <p className="text-2xl font-bold text-gray-900">{activeStudents}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <UserIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Inactive Students</p>
                            <p className="text-2xl font-bold text-gray-900">{inactiveStudents}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <AcademicCapIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Graduated</p>
                            <p className="text-2xl font-bold text-gray-900">{graduatedStudents}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Classes</p>
                            <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* Controls */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                            {/* Search */}
                            <div className="relative">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                                />
                            </div>

                            {/* Class Filter */}
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Classes</option>
                                {classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.name}
                                    </option>
                                ))}
                            </select>

                            {/* Status Filter */}
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Graduated">Graduated</option>
                                <option value="Transferred">Transferred</option>
                            </select>
                        </div>

                        {/* Add Student Button */}
                        {canCreate && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Register Student
                            </button>
                        )}
                    </div>
                </div>

                {/* Students Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading students...</p>
                        </div>
                    ) : students.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Admission No.
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Class
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Parent Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.map((student) => (
                                    <StudentRow
                                        key={student.id}
                                        student={student}
                                        onEdit={canEdit ? () => setEditingStudent(student) : undefined}
                                        onDelete={canDelete ? () => setDeletingStudent(student) : undefined}
                                        currentUser={currentUser}
                                    />
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12">
                            <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
                            <p className="text-gray-500">
                                {searchTerm || selectedClass || selectedStatus
                                    ? 'Try adjusting your search criteria.'
                                    : 'Get started by registering your first student.'}
                            </p>
                            {canCreate && !searchTerm && !selectedClass && !selectedStatus && (
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="mt-4 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                >
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Register First Student
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing page {currentPage} of {totalPages} ({totalStudents} total students)
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showAddModal && (
                <AddStudentModal
                    onClose={() => setShowAddModal(false)}
                    onAddStudent={handleAddStudent}
                    classes={classes}
                />
            )}

            {editingStudent && (
                <EditStudentModal
                    student={editingStudent}
                    onClose={() => setEditingStudent(null)}
                    onUpdateStudent={handleUpdateStudent}
                    classes={classes}
                />
            )}

            {deletingStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Student</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete {deletingStudent.firstName} {deletingStudent.lastName}? 
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setDeletingStudent(null)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteStudent(deletingStudent.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {credentialsToShow && (
                <StudentCredentialsModal
                    credentials={credentialsToShow}
                    onClose={() => setCredentialsToShow(null)}
                />
            )}
        </div>
    );
};

export default StudentManagement;