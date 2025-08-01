import React, { useState } from 'react';
import { MOCK_ATTENDANCE_RECORDS, MOCK_CLASSES } from '../constants';
import { AttendanceRecord } from '../types';
import { ChevronDownIcon } from './icons';
import { AttendanceRow } from './attendance/AttendanceRow';

const Attendance: React.FC = () => {
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE_RECORDS);

    const handleStatusChange = (studentId: string, status: AttendanceRecord['status']) => {
        setAttendanceData(prevData => prevData.map(record => 
            record.studentId === studentId ? { ...record, status } : record
        ));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
            <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Mark Attendance</h2>
                    <p className="text-sm text-gray-500 mt-1">Select class and date to mark attendance.</p>
                </div>
                <div className="flex items-center flex-wrap gap-2 mt-4 md:mt-0">
                    <div className="relative">
                        <select className="pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition appearance-none">
                           {MOCK_CLASSES.map(c => <option key={c.id}>{c.name}</option>)}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                     <input type="date" defaultValue={new Date().toISOString().substring(0, 10)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th scope="col" className="py-3 px-6 font-medium">Student Name</th>
                            <th scope="col" className="py-3 px-6 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {attendanceData.map(record => <AttendanceRow key={record.studentId} record={record} onStatusChange={handleStatusChange} />)}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-gray-200 flex items-center justify-end">
                 <button className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition">
                    Submit Attendance
                </button>
            </div>
        </div>
    );
};

export default Attendance;