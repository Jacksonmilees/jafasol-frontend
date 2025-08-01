
import React, { useState } from 'react';
import { MOCK_TEACHERS } from '../constants';
import { PlusIcon, SearchIcon, ChalkboardTeacherIcon } from './icons';
import { TeacherRow } from './teachers/TeacherRow';
import { AddTeacherModal } from './teachers/AddTeacherModal';
import { EditTeacherModal } from './teachers/EditTeacherModal';
import { Teacher, User, Page } from '../types';

interface TeacherManagementProps {
    currentUser: User;
}

const TeacherManagement: React.FC<TeacherManagementProps> = ({ currentUser }) => {
    const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);

    const handleAddTeacher = (newTeacherData: Omit<Teacher, 'id' | 'status' | 'avatarUrl'>) => {
        const newTeacher: Teacher = {
            id: `T${(teachers.length + 10).toString().padStart(3, '0')}`,
            ...newTeacherData,
            status: 'Active',
            avatarUrl: `https://picsum.photos/seed/T${Math.random()}/40/40`,
        };
        setTeachers([newTeacher, ...teachers]);
        setIsAddModalOpen(false);
    };
    
    const handleUpdateTeacher = (updatedTeacher: Teacher) => {
        setTeachers(teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
        setTeacherToEdit(null);
    };

    const canCreate = currentUser.role.permissions[Page.Teachers]?.create;

    return (
        <>
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm">
                <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">Teacher Management</h2>
                        <p className="text-sm text-slate-500 mt-1">Register teachers and assign subjects or classes.</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search teachers..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none transition"
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
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="py-3 px-6 font-medium">Teacher</th>
                                <th scope="col" className="py-3 px-6 font-medium">Subjects Taught</th>
                                <th scope="col" className="py-3 px-6 font-medium">Classes Assigned</th>
                                <th scope="col" className="py-3 px-6 font-medium">Status</th>
                                <th scope="col" className="py-3 px-6 font-medium"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {teachers.map(teacher => (
                                <TeacherRow 
                                    key={teacher.id} 
                                    teacher={teacher}
                                    onEdit={setTeacherToEdit}
                                    currentUser={currentUser}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600">
                    <p>Showing 1 to {teachers.length} of {teachers.length} results</p>
                    <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-100 transition-colors">Previous</button>
                        <button className="px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-100 transition-colors">Next</button>
                    </div>
                </div>
            </div>

            {isAddModalOpen && <AddTeacherModal onClose={() => setIsAddModalOpen(false)} onAddTeacher={handleAddTeacher} />}
            {teacherToEdit && <EditTeacherModal teacher={teacherToEdit} onClose={() => setTeacherToEdit(null)} onUpdateTeacher={handleUpdateTeacher} />}
        </>
    );
};

export default TeacherManagement;
