import React, { useState, useEffect } from 'react';
import { 
    TimetableIcon, 
    TableIcon, 
    PlusIcon, 
    CalendarDaysIcon, 
    UsersIcon, 
    BookOpenIcon,
    AcademicsIcon,
    DownloadIcon,
    SettingsIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon
} from './icons';
import { User, Page, Subject, SchoolClass, Teacher } from '../types';
import type { Timetable } from '../types';
import apiClient from '../api';

interface TimetableProps {
    currentUser?: User;
    addAuditLog?: (action: string, details: string) => void;
}

const Timetable: React.FC<TimetableProps> = ({ currentUser, addAuditLog }) => {
    const [activeTab, setActiveTab] = useState<'management' | 'generator' | 'teacher-view' | 'exam'>('management');
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [classes, setClasses] = useState<SchoolClass[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [timetables, setTimetables] = useState<Timetable[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Permission checks
    const isAdmin = currentUser?.role?.name === 'Admin';
    const canCreate = isAdmin || currentUser?.role?.permissions?.[Page.Timetable]?.create || false;
    const canEdit = isAdmin || currentUser?.role?.permissions?.[Page.Timetable]?.edit || false;
    const canDelete = isAdmin || currentUser?.role?.permissions?.[Page.Timetable]?.delete || false;

    // Load data from API
    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('🔄 Loading timetable data...');
            const [subjectsResponse, classesResponse, teachersResponse, timetablesResponse] = await Promise.all([
                apiClient.getSubjects(),
                apiClient.getClasses(),
                apiClient.getTeachers(),
                apiClient.getTimetables()
            ]);
            
            console.log('📊 Timetable data loaded:', {
                subjects: subjectsResponse.subjects?.length || 0,
                classes: classesResponse.classes?.length || 0,
                teachers: teachersResponse.teachers?.length || 0,
                timetables: timetablesResponse.timetables?.length || 0
            });
            
            setSubjects(subjectsResponse.subjects || []);
            setClasses(classesResponse.classes || []);
            setTeachers(teachersResponse.teachers || []);
            setTimetables(timetablesResponse.timetables || []);
        } catch (error) {
            console.error('❌ Failed to load timetable data:', error);
            setError('Failed to load data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadData();
    }, []);

    // Calculate statistics
    const totalTimetables = timetables.length;
    const activeTimetables = timetables.filter(t => t.status === 'Active').length;
    const draftTimetables = timetables.filter(t => t.status === 'Draft').length;
    const totalSlots = timetables.reduce((sum, t) => sum + (t.slots?.length || 0), 0);

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
                            <TimetableIcon className="h-8 w-8 text-blue-600 mr-3" />
                            Timetable Management
                        </h2>
                        <p className="text-gray-600 mt-2 text-lg">Create, manage, and view class schedules and exam timetables</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm mt-4 md:mt-0">
                        <p className="text-sm text-gray-500 font-medium">Current Term</p>
                        <p className="text-xl font-bold text-blue-600">Term 1, 2024</p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <TimetableIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Timetables</p>
                            <p className="text-2xl font-bold text-gray-900">{totalTimetables}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CalendarDaysIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Active Timetables</p>
                            <p className="text-2xl font-bold text-gray-900">{activeTimetables}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <PencilIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Draft Timetables</p>
                            <p className="text-2xl font-bold text-gray-900">{draftTimetables}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <AcademicsIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Slots</p>
                            <p className="text-2xl font-bold text-gray-900">{totalSlots}</p>
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
                            onClick={() => setActiveTab('management')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center ${
                                activeTab === 'management'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <TimetableIcon className="h-5 w-5 mr-2" />
                            Timetable Management
                        </button>
                        <button
                            onClick={() => setActiveTab('generator')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center ${
                                activeTab === 'generator'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Generate Timetable
                        </button>
                        <button
                            onClick={() => setActiveTab('teacher-view')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center ${
                                activeTab === 'teacher-view'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <UsersIcon className="h-5 w-5 mr-2" />
                            Teacher View
                        </button>
                        <button
                            onClick={() => setActiveTab('exam')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center ${
                                activeTab === 'exam'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <TableIcon className="h-5 w-5 mr-2" />
                            Exam Timetable
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading timetable data...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'management' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">Timetable Management</h3>
                                            <p className="text-gray-500 mt-1">View, edit, and manage all timetables</p>
                                        </div>
                                        {canCreate && (
                                            <button 
                                                onClick={() => setActiveTab('generator')}
                                                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm">
                                                <PlusIcon className="h-4 w-4 mr-2" />
                                                Create New Timetable
                                            </button>
                                        )}
                                    </div>
                                    
                                    {/* Timetables List */}
                                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                        <div className="p-6 border-b border-gray-200">
                                            <h4 className="text-lg font-semibold text-gray-800">All Timetables</h4>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                                    <tr>
                                                        <th scope="col" className="py-4 px-6 font-medium">Name</th>
                                                        <th scope="col" className="py-4 px-6 font-medium">Type</th>
                                                        <th scope="col" className="py-4 px-6 font-medium">Academic Year</th>
                                                        <th scope="col" className="py-4 px-6 font-medium">Status</th>
                                                        <th scope="col" className="py-4 px-6 font-medium">Slots</th>
                                                        <th scope="col" className="py-4 px-6 font-medium">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {timetables.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                                <TimetableIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                                                <p className="text-lg font-medium text-gray-900 mb-1">No timetables found</p>
                                                                <p className="text-sm">Create your first timetable to get started.</p>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        timetables.map(timetable => (
                                                            <tr key={timetable.id} className="hover:bg-gray-50">
                                                                <td className="py-4 px-6">
                                                                    <div>
                                                                        <p className="font-medium text-gray-900">{timetable.name}</p>
                                                                        <p className="text-sm text-gray-500">{timetable.term}</p>
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 px-6">
                                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                        timetable.type === 'Teaching' 
                                                                            ? 'bg-blue-100 text-blue-800' 
                                                                            : 'bg-red-100 text-red-800'
                                                                    }`}>
                                                                        {timetable.type}
                                                                    </span>
                                                                </td>
                                                                <td className="py-4 px-6 text-gray-900">{timetable.academicYear}</td>
                                                                <td className="py-4 px-6">
                                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                        timetable.status === 'Active' 
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : timetable.status === 'Draft'
                                                                            ? 'bg-yellow-100 text-yellow-800'
                                                                            : 'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {timetable.status}
                                                                    </span>
                                                                </td>
                                                                <td className="py-4 px-6 text-gray-900">{timetable.slots?.length || 0}</td>
                                                                <td className="py-4 px-6">
                                                                    <div className="flex items-center space-x-2">
                                                                        <button className="p-1 text-blue-600 hover:text-blue-800">
                                                                            <EyeIcon className="h-4 w-4" />
                                                                        </button>
                                                                        {canEdit && (
                                                                            <button className="p-1 text-gray-600 hover:text-gray-800">
                                                                                <PencilIcon className="h-4 w-4" />
                                                                            </button>
                                                                        )}
                                                                        {canDelete && (
                                                                            <button className="p-1 text-red-600 hover:text-red-800">
                                                                                <TrashIcon className="h-4 w-4" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'generator' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">Timetable Generator</h3>
                                            <p className="text-gray-500 mt-1">Automatically generate optimized timetables</p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <button 
                                                onClick={() => setActiveTab('management')}
                                                className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all duration-200">
                                                <EyeIcon className="h-4 w-4 mr-2" />
                                                View All
                                            </button>
                                            <button 
                                                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all duration-200">
                                                <DownloadIcon className="h-4 w-4 mr-2" />
                                                Export PDF
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Generator Form */}
                                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Generate New Timetable</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                                                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                                    <option value="2024">2024</option>
                                                    <option value="2025">2025</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
                                                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                                    <option value="Term 1">Term 1</option>
                                                    <option value="Term 2">Term 2</option>
                                                    <option value="Term 3">Term 3</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                                                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                                    <option value="">Select a class</option>
                                                    {classes.map(cls => (
                                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Timetable Type</label>
                                                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                                    <option value="Teaching">Teaching Timetable</option>
                                                    <option value="Exam">Exam Timetable</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <button className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                                Generate Timetable
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'teacher-view' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">Teacher Timetable View</h3>
                                            <p className="text-gray-500 mt-1">Role-specific timetable views for teachers</p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <button 
                                                onClick={() => setActiveTab('management')}
                                                className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all duration-200">
                                                <EyeIcon className="h-4 w-4 mr-2" />
                                                View All
                                            </button>
                                            <button 
                                                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200">
                                                <DownloadIcon className="h-4 w-4 mr-2" />
                                                Export Teacher View
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Teacher View */}
                                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Teacher Timetable Dashboard</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <h5 className="font-medium text-blue-900 mb-2">Class Teachers</h5>
                                                <p className="text-sm text-blue-700">View assigned class timetable + personal teaching hours</p>
                                            </div>
                                            <div className="bg-green-50 rounded-lg p-4">
                                                <h5 className="font-medium text-green-900 mb-2">Subject Teachers</h5>
                                                <p className="text-sm text-green-700">View only teaching hours across different classes</p>
                                            </div>
                                            <div className="bg-purple-50 rounded-lg p-4">
                                                <h5 className="font-medium text-purple-900 mb-2">All Teachers</h5>
                                                <p className="text-sm text-purple-700">Comprehensive view of all teaching assignments</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'exam' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">Exam Timetable</h3>
                                            <p className="text-gray-500 mt-1">Manage examination schedules and timetables</p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <button 
                                                onClick={() => setActiveTab('management')}
                                                className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all duration-200">
                                                <EyeIcon className="h-4 w-4 mr-2" />
                                                View All
                                            </button>
                                            <button 
                                                className="flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-all duration-200">
                                                <PlusIcon className="h-4 w-4 mr-2" />
                                                Create Exam Timetable
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                                        <TableIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Exam Timetable Management</h3>
                                        <p className="text-gray-500 mb-6">Create and manage examination timetables for different terms and subjects.</p>
                                        <div className="flex justify-center space-x-4">
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                Create Exam Timetable
                                            </button>
                                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                                View Existing
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Timetable;