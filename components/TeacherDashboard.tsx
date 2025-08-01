

import React from 'react';
import { User, Page, Student } from '../types';
import { MOCK_TEACHERS, MOCK_CLASSES, MOCK_STUDENTS } from '../constants';
import { AttendanceIcon, ExamsIcon, TimetableIcon, BookMarkedIcon, BookOpenIcon, ChalkboardTeacherIcon, GraduationCapIcon, UsersIcon } from './icons';
import { StudentRow } from './students/StudentRow';

interface TeacherDashboardProps {
  currentUser: User;
  setCurrentPage: (page: Page) => void;
}

const QuickActionCard: React.FC<{ icon: React.ReactNode, title: string, page: Page, onClick: (page: Page) => void }> = ({ icon, title, page, onClick }) => (
    <button onClick={() => onClick(page)} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm text-left hover:border-indigo-500 hover:shadow-md transition-all group">
        <div className="p-3 bg-slate-100 rounded-lg w-fit group-hover:bg-indigo-100 transition-colors">
            {icon}
        </div>
        <p className="font-semibold text-slate-800 mt-4">{title}</p>
        <p className="text-sm text-slate-500">Go to {title}</p>
    </button>
);

const ClassTeacherSpecifics: React.FC<{ classInCharge: any }> = ({ classInCharge }) => {
    const classStudents = MOCK_STUDENTS.filter(s => s.formClass === classInCharge.name.split(' ')[0] && s.stream === classInCharge.stream);

    // Find all teachers who teach this class
    const subjectTeachers = MOCK_TEACHERS.filter(t => t.classes.includes(classInCharge.name));

    return (
        <div className="space-y-8">
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 shadow-sm">
                <h3 className="text-xl font-bold text-indigo-800">My Class Overview: {classInCharge.name}</h3>
                <p className="text-indigo-700/80">You are the designated class teacher. Here is a summary of your class.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-center">
                    <div className="bg-white p-3 rounded-lg">
                        <p className="text-2xl font-bold text-indigo-600">{classStudents.length}</p>
                        <p className="text-sm text-slate-500">Students</p>
                    </div>
                     <div className="bg-white p-3 rounded-lg">
                        <p className="text-2xl font-bold text-indigo-600">94%</p>
                        <p className="text-sm text-slate-500">Attendance</p>
                    </div>
                     <div className="bg-white p-3 rounded-lg">
                        <p className="text-2xl font-bold text-indigo-600">68.5%</p>
                        <p className="text-sm text-slate-500">Avg. Score</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                        <p className="text-2xl font-bold text-indigo-600">{subjectTeachers.length}</p>
                        <p className="text-sm text-slate-500">Teachers</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* My Class Students */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="p-4 md:p-6 border-b border-slate-200 flex items-center">
                        <GraduationCapIcon className="h-6 w-6 text-slate-500 mr-3"/>
                        <h3 className="text-lg font-semibold text-slate-800">My Students ({classStudents.length})</h3>
                    </div>
                    <div className="p-4 md:p-6 h-64 overflow-y-auto">
                        <div className="space-y-3">
                        {classStudents.map(student => (
                            <div key={student.id} className="flex items-center">
                                <img src={student.avatarUrl} alt={student.firstName} className="h-9 w-9 rounded-full mr-3" />
                                <div>
                                    <p className="font-medium text-slate-700 text-sm">{student.firstName} {student.lastName}</p>
                                    <p className="text-xs text-slate-500">{student.admissionNumber}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                {/* My Class Subject Teachers */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="p-4 md:p-6 border-b border-slate-200 flex items-center">
                        <UsersIcon className="h-6 w-6 text-slate-500 mr-3"/>
                        <h3 className="text-lg font-semibold text-slate-800">Subject Teachers for {classInCharge.name}</h3>
                    </div>
                    <div className="p-4 md:p-6 h-64 overflow-y-auto">
                        <div className="space-y-3">
                        {subjectTeachers.map(teacher => (
                            <div key={teacher.id} className="flex items-center">
                                <img src={teacher.avatarUrl} alt={teacher.name} className="h-9 w-9 rounded-full mr-3" />
                                <div>
                                    <p className="font-medium text-slate-700 text-sm">{teacher.name}</p>
                                    <p className="text-xs text-slate-500">{teacher.subjects.join(', ')}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ currentUser, setCurrentPage }) => {
    const teacherDetails = MOCK_TEACHERS.find(t => t.id === currentUser.id || t.email === currentUser.email);
    const myClassInCharge = MOCK_CLASSES.find(c => c.classTeacherId === currentUser.id);
    
    const quickActions = [
        { title: 'Mark Attendance', page: Page.Attendance, icon: <AttendanceIcon className="h-6 w-6 text-indigo-500" /> },
        { title: 'Manage Exams', page: Page.Exams, icon: <ExamsIcon className="h-6 w-6 text-green-500" /> },
        { title: 'View Timetable', page: Page.Timetable, icon: <TimetableIcon className="h-6 w-6 text-amber-500" /> },
        { title: 'Learning Resources', page: Page.LearningResources, icon: <BookMarkedIcon className="h-6 w-6 text-blue-500" /> },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Welcome back, {currentUser.name.split(' ')[0]}!</h2>
                <p className="text-slate-500 mt-1">Your personalized dashboard is ready.</p>
            </div>
            
            {myClassInCharge && currentUser.role.name === 'Class Teacher' && <ClassTeacherSpecifics classInCharge={myClassInCharge} />}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map(action => (
                    <QuickActionCard 
                        key={action.page}
                        icon={action.icon}
                        title={action.title}
                        page={action.page}
                        onClick={setCurrentPage}
                    />
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Assigned Classes Card */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="p-4 md:p-6 border-b border-slate-200 flex items-center">
                        <ChalkboardTeacherIcon className="h-6 w-6 text-slate-500 mr-3"/>
                        <h3 className="text-lg font-semibold text-slate-800">My Classes (as Subject Teacher)</h3>
                    </div>
                    <div className="p-4 md:p-6">
                        {teacherDetails && teacherDetails.classes.length > 0 ? (
                            <div className="space-y-2">
                                {teacherDetails.classes.map(className => (
                                    <div key={className} className="p-3 bg-slate-50 rounded-lg font-medium text-slate-700">
                                        {className}
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <p className="text-sm text-slate-500 italic">No classes assigned.</p>
                        )}
                    </div>
                </div>

                {/* Assigned Subjects Card */}
                 <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="p-4 md:p-6 border-b border-slate-200 flex items-center">
                        <BookOpenIcon className="h-6 w-6 text-slate-500 mr-3"/>
                        <h3 className="text-lg font-semibold text-slate-800">My Subjects</h3>
                    </div>
                    <div className="p-4 md:p-6">
                        {teacherDetails && teacherDetails.subjects.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {teacherDetails.subjects.map(subject => (
                                    <span key={subject} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                                        {subject}
                                    </span>
                                ))}
                            </div>
                        ) : (
                             <p className="text-sm text-slate-500 italic">No subjects assigned.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};