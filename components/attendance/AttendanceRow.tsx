import React from 'react';
import { AttendanceRecord } from '../../types';

export const AttendanceRow: React.FC<{ record: AttendanceRecord, onStatusChange: (studentId: string, status: AttendanceRecord['status']) => void }> = ({ record, onStatusChange }) => {
    
    const getButtonClass = (status: AttendanceRecord['status']) => {
        const baseClass = "px-3 py-1 text-xs font-medium rounded-full transition-colors";
        if (record.status === status) {
            switch(status) {
                case 'Present': return `${baseClass} bg-green-600 text-white`;
                case 'Absent': return `${baseClass} bg-red-600 text-white`;
                case 'Late': return `${baseClass} bg-yellow-500 text-white`;
            }
        }
        return `${baseClass} bg-slate-200 text-slate-700 hover:bg-slate-300`;
    };

    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="py-3 px-6">
                <div className="flex items-center">
                    <img className="h-9 w-9 rounded-full object-cover" src={record.avatarUrl} alt={record.studentName} />
                    <div className="ml-3">
                        <p className="font-semibold text-slate-800">{record.studentName}</p>
                        <p className="text-xs text-slate-500">{record.studentId}</p>
                    </div>
                </div>
            </td>
            <td className="py-3 px-6">
                <div className="flex items-center space-x-2">
                   <button onClick={() => onStatusChange(record.studentId, 'Present')} className={getButtonClass('Present')}>Present</button>
                   <button onClick={() => onStatusChange(record.studentId, 'Absent')} className={getButtonClass('Absent')}>Absent</button>
                   <button onClick={() => onStatusChange(record.studentId, 'Late')} className={getButtonClass('Late')}>Late</button>
                </div>
            </td>
        </tr>
    );
};
