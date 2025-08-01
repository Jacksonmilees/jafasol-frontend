import React, { useState, useMemo } from 'react';
import { MOCK_STUDENTS } from '../../constants';
import { Student } from '../../types';
import { StudentPerformanceChart } from './StudentPerformanceChart';
import { SearchIcon } from '../icons';

export const StudentTrendAnalysis: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(MOCK_STUDENTS[0]);

    const filteredStudents = useMemo(() => {
        if (!searchTerm) return [];
        return MOCK_STUDENTS.filter(s => 
            `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 5); // Limit results
    }, [searchTerm]);

    const handleSelectStudent = (student: Student) => {
        setSelectedStudent(student);
        setSearchTerm('');
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">Student Performance Trend</h3>
                <p className="text-sm text-gray-500 mt-1">Search for a student to view their academic progress over time.</p>
            </div>
            <div className="relative max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or admission no..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition"
                />
                {filteredStudents.length > 0 && (
                    <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        {filteredStudents.map(student => (
                            <button
                                key={student.id}
                                onClick={() => handleSelectStudent(student)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors"
                            >
                                <p className="font-medium text-gray-800">{student.firstName} {student.lastName}</p>
                                <p className="text-xs text-gray-500">{student.admissionNumber}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            {selectedStudent ? (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-bold text-xl text-gray-800 mb-4">
                        Showing trends for: {selectedStudent.firstName} {selectedStudent.lastName}
                    </h4>
                    <StudentPerformanceChart student={selectedStudent} />
                </div>
            ) : (
                <div className="mt-4 p-8 text-center border-2 border-dashed rounded-lg text-gray-500">
                    <p>Select a student to view their performance trend.</p>
                </div>
            )}
        </div>
    );
};