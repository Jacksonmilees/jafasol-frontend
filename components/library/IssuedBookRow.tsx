import React from 'react';
import { BookIssue } from '../../types';
import { MoreHorizontalIcon } from '../icons';

export const IssuedBookRow: React.FC<{ issue: BookIssue }> = ({ issue }) => {
    const statusColor = issue.status === 'Overdue' ? 'text-red-600' : 'text-slate-600';
    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="py-3 px-6">
                <p className="font-semibold text-slate-800">{issue.bookTitle}</p>
                <p className="text-xs text-slate-500">{issue.studentName}</p>
            </td>
            <td className={`py-3 px-6 text-sm ${statusColor}`}>{issue.dueDate}</td>
            <td className="py-3 px-6 text-right">
                <button className="p-2 rounded-md hover:bg-slate-200 transition-colors" aria-label={`Actions for ${issue.bookTitle}`}>
                    <MoreHorizontalIcon className="h-5 w-5 text-slate-500" />
                </button>
            </td>
        </tr>
    );
};
