import React, { useState } from 'react';
import { MOCK_STUDENTS } from '../constants';
import { PlusIcon, SearchIcon, UploadCloudIcon } from './icons';
import { StudentRow } from './students/StudentRow';
import { AddStudentModal } from './students/AddStudentModal';
import { EditStudentModal } from './students/EditStudentModal';
import { StudentDetailModal } from './students/StudentDetailModal';
import { BulkUploadModal } from './students/BulkUploadModal';
import { Student, User, Page } from '../types';

interface StudentManagementProps {
    currentUser: User;
}

const StudentManagement: React.FC<StudentManagementProps> = ({ currentUser }) => {
    const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
    const [studentToView, setStudentToView] = useState<Student | null>(null);

    const handleAddStudent = (newStudentData: Omit<Student, 'id' | 'status' | 'enrollmentDate' | 'avatarUrl'>) => {
        const newStudent: Student = {
            id: `S${(students.length + 10).toString().padStart(3, '0')}`,
            ...newStudentData,
            status: 'Active',
            enrollmentDate: new Date().toISOString().split('T')[0],
            avatarUrl: `https://picsum.photos/seed/S${Math.random()}/40/40`,
        };
        setStudents([newStudent, ...students]);
        setIsAddModalOpen(false);
    };
    
    const handleUpdateStudent = (updatedStudent: Student) => {
        setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
        setStudentToEdit(null);
    };

    const handleBulkAddStudents = (newStudentsData: Omit<Student, 'id' | 'status' | 'enrollmentDate' | 'avatarUrl' | 'examResults' | 'isRegistered'>[]) => {
        const newStudents: Student[] = newStudentsData.map((studentData, index) => ({
            id: `S${(students.length + 10 + index).toString().padStart(3, '0')}`,
            ...studentData,
            status: 'Active',
            enrollmentDate: new Date().toISOString().split('T')[0],
            avatarUrl: `https://picsum.photos/seed/S${Math.random()}/40/40`,
            examResults: {},
            isRegistered: false,
        }));

        setStudents(prevStudents => [...newStudents, ...prevStudents]);
        setIsBulkUploadModalOpen(false);
    };
    
    const canCreate = currentUser.role.permissions[Page.Students]?.create;

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
                <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Student List</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage all students in the school.</p>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center mt-4 md:mt-0">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search students..."
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
                            {students.map(student => (
                                <StudentRow 
                                    key={student.id} 
                                    student={student}
                                    currentUser={currentUser}
                                    onViewDetails={setStudentToView}
                                    onEdit={setStudentToEdit}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                    <p className="text-xs sm:text-sm">Showing 1 to {students.length} of {students.length} results</p>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-xs sm:text-sm">Previous</button>
                        <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-xs sm:text-sm">Next</button>
                    </div>
                </div>
            </div>

            {isAddModalOpen && <AddStudentModal onClose={() => setIsAddModalOpen(false)} onAddStudent={handleAddStudent} />}
            {isBulkUploadModalOpen && <BulkUploadModal onClose={() => setIsBulkUploadModalOpen(false)} onImport={handleBulkAddStudents} />}
            {studentToView && <StudentDetailModal student={studentToView} onClose={() => setStudentToView(null)} />}
            {studentToEdit && <EditStudentModal student={studentToEdit} onClose={() => setStudentToEdit(null)} onUpdateStudent={handleUpdateStudent} />}
        </>
    );
};

export default StudentManagement;