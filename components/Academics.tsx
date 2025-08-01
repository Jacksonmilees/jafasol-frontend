import React, { useState } from 'react';
import { MOCK_ACADEMIC_YEAR, MOCK_SUBJECTS, MOCK_CLASSES, MOCK_TEACHERS } from '../constants';
import { PlusIcon } from './icons';
import { SubjectRow } from './academics/SubjectRow';
import { ClassRow } from './academics/ClassRow';
import { AddClassModal } from './academics/AddClassModal';
import { EditClassModal } from './academics/EditClassModal';
import { DeleteClassModal } from './academics/DeleteClassModal';
import { AddSubjectModal } from './academics/AddSubjectModal';
import { SchoolClass, Subject, User, Page } from '../types';

interface AcademicsProps {
    currentUser: User;
}

const Academics: React.FC<AcademicsProps> = ({ currentUser }) => {
    const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
    const [classes, setClasses] = useState<SchoolClass[]>(MOCK_CLASSES);

    const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
    const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);

    const [classToEdit, setClassToEdit] = useState<SchoolClass | null>(null);
    const [classToDelete, setClassToDelete] = useState<SchoolClass | null>(null);

    const handleAddSubject = (newSubjectData: Omit<Subject, 'id'>) => {
        const newSubject: Subject = {
            id: `SUB${(subjects.length + 10).toString()}`,
            ...newSubjectData
        };
        setSubjects([newSubject, ...subjects]);
        setIsAddSubjectModalOpen(false);
    };

    const handleAddClass = (newClassData: Omit<SchoolClass, 'id' | 'students'>) => {
        const newClass: SchoolClass = {
            id: `CLS${(classes.length + 10).toString().padStart(2, '0')}`,
            ...newClassData,
            students: 0, // New classes start with 0 students
        };
        setClasses([newClass, ...classes]);
        setIsAddClassModalOpen(false);
    };

    const handleUpdateClass = (updatedClass: SchoolClass) => {
        setClasses(classes.map(c => c.id === updatedClass.id ? updatedClass : c));
        setClassToEdit(null);
    };
    
    const handleDeleteClass = (classId: string) => {
        setClasses(classes.filter(c => c.id !== classId));
        setClassToDelete(null);
    };

    const canCreate = currentUser.role.permissions[Page.Academics]?.create;

    return (
        <>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Academic Structure</h2>
                        <p className="text-gray-500 mt-1">Manage academic years, subjects, and classes.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mt-4 md:mt-0">
                        <p className="text-sm text-gray-500">Current Academic Year</p>
                        <p className="text-lg font-bold text-teal-600">{MOCK_ACADEMIC_YEAR.year} - {MOCK_ACADEMIC_YEAR.currentTerm}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Subjects List */}
                    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
                        <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Subjects</h3>
                            {canCreate && (
                                <button 
                                    onClick={() => setIsAddSubjectModalOpen(true)}
                                    className="flex items-center justify-center px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition">
                                    <PlusIcon className="h-4 w-4 mr-1.5" />
                                    New Subject
                                </button>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                    <tr>
                                        <th scope="col" className="py-3 px-6 font-medium">Subject Name</th>
                                        <th scope="col" className="py-3 px-6 font-medium">Curriculum</th>
                                        <th scope="col" className="py-3 px-6 font-medium">Levels</th>
                                        <th scope="col" className="py-3 px-6 font-medium"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {subjects.map(subject => <SubjectRow key={subject.id} subject={subject} />)}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Classes List */}
                    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
                        <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Classes</h3>
                            {canCreate && (
                                <button 
                                    onClick={() => setIsAddClassModalOpen(true)}
                                    className="flex items-center justify-center px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition">
                                    <PlusIcon className="h-4 w-4 mr-1.5" />
                                    New Class
                                </button>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                    <tr>
                                        <th scope="col" className="py-3 px-6 font-medium">Class Name</th>
                                        <th scope="col" className="py-3 px-6 font-medium">Class Teacher</th>
                                        <th scope="col" className="py-3 px-6 font-medium">Students</th>
                                        <th scope="col" className="py-3 px-6 font-medium"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {classes.map(c => 
                                        <ClassRow 
                                            key={c.id} 
                                            schoolClass={c} 
                                            onEdit={setClassToEdit}
                                            onDelete={setClassToDelete}
                                            currentUser={currentUser}
                                        />
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            {isAddSubjectModalOpen && <AddSubjectModal onClose={() => setIsAddSubjectModalOpen(false)} onAddSubject={handleAddSubject} />}
            {isAddClassModalOpen && <AddClassModal teachers={MOCK_TEACHERS} onClose={() => setIsAddClassModalOpen(false)} onAddClass={handleAddClass} />}
            {classToEdit && <EditClassModal schoolClass={classToEdit} teachers={MOCK_TEACHERS} onClose={() => setClassToEdit(null)} onUpdateClass={handleUpdateClass} />}
            {classToDelete && <DeleteClassModal schoolClass={classToDelete} onClose={() => setClassToDelete(null)} onDelete={handleDeleteClass} />}
        </>
    );
};

export default Academics;